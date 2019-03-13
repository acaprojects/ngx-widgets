import { Component, Input, Output, EventEmitter, ComponentFactoryResolver, SimpleChanges, ChangeDetectorRef, Injector, Renderer2 } from '@angular/core';

import { OverlayContainerComponent } from '../../../overlays/overlay-container/overlay-container.component';

import { IMapPointOfInterest } from '../map.component';
import { MapUtilities } from '../map.utilities';
import { WIDGETS } from '../../../../settings';
import { MapService } from '../../../../services/map.service';
import { Utility } from '../../../../shared/utility';

@Component({
    selector: 'map-overlay-container',
    template: `
        <div #el class="overlay-container" (window:resize)="updateItems()">
            <div><ng-container #content></ng-container></div>
        </div>
    `, styles: [`
        .overlay-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            pointer-events: none;
        }
        .overlay-container > div {
            pointer-events: auto;
        }
    `]
})
export class MapOverlayContainerComponent extends OverlayContainerComponent {
    @Input() items: IMapPointOfInterest[];
    @Input() map: SVGElement;
    @Input() container: HTMLDivElement;
    @Input() scale: number;
    @Output() event = new EventEmitter();

    protected map_service: MapService;

    private list: IMapPointOfInterest[] = [];

    constructor(protected _cfr: ComponentFactoryResolver, protected _cdr: ChangeDetectorRef, protected injector: Injector, protected renderer: Renderer2) {
        super(_cfr, _cdr, injector);
        this.id = `map-container-${Math.floor(Math.random() * 8999999 + 1000000)}`;
    }

    public ngOnInit() {
        super.ngOnInit();
        this.map_service = this.injector ? this.injector.get(MapService) : null;
        if (this.service) {
            this.service.registerContainer(this.id, this);
        }
        if (Utility.isIE()) {
            this.renderer.listen('window', 'resize', () => {
                this.clearItems(true);
                this.timeout('update', () => this.updateItems(), 200);
            })
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (changes.items || changes.map) {
            this.clearItems(!changes.map);
            this.timeout('update', () => this.updateItems(), changes.map && !changes.map.previousValue ? 1000 : 200);
        }
        if (changes.scale) {
            this.update();
        }
    }

    public update() {
        for (const item of (this.list || [])) {
            if (item.instance) {
                if (!item.model) { item.model = item.data || {}; }
                item.model.scale = this.scale;
                item.instance.set(item.model);
            }
        }
    }

    /**
     * Render new overlay items on the container
     */
    public updateItems() {
        if (!this.map || !this.container) {
            return this.timeout('update', () => this.updateItems());
        }
        const view_box = this.map.getAttribute('viewBox').split(' ');
        const map_box = this.map.getBoundingClientRect();
        const box = this.container.getBoundingClientRect();
        const x_scale = Math.max(1, (map_box.width / map_box.height) / (+view_box[2] / +view_box[3]));
        const y_scale = Math.max(1, (map_box.height / map_box.width) / (+view_box[3] / +view_box[2]));
        for (const item of (this.items || [])) {
            if (!item.exists) {
                this.add(item.id, item.cmp).then((inst: any) => {
                    if (!item.model) { item.model = item.data || {}; }
                    const el = item.id ? this.map.querySelector(MapUtilities.cleanCssSelector(`#${item.id}`)) : null;
                    if (el || item.coordinates) {
                        const pos_box = Utility.isIE() && item.coordinates ? { width: +view_box[2], height: +view_box[3] } : box;
                        item.model.center = MapUtilities.getPosition(pos_box, el, item.coordinates) || { x: .5, y: .5 };
                        if (Utility.isIE() && item.coordinates) {
                            // Normalise dimensions
                            item.model.center.x = item.model.center.x / x_scale + (x_scale - 1) / 2;
                            item.model.center.y = item.model.center.y / y_scale + (y_scale - 1) / 2;
                        }
                        item.instance = inst;
                        item.model.scale = this.scale;
                        inst.service = this.service ? this.service.getService() || item.service : item.service;
                        inst.set(item.model);
                        inst.fn = {
                            event: (e) => this.event.emit({ id: item.id, type: 'overlay', item, details: event }),
                            close: () => {
                                this.event.emit({ id: item.id, type: 'overlay', item, details: { type: 'close' } });
                                this.remove(item.id);
                            }
                        };
                        if (inst.init instanceof Function) { inst.init(); }
                    } else {
                        this.map_service.log('Warn', `Unable to find element with ID '${item.id}'`);
                    }
                }, (e) => WIDGETS.log('MAP][OVERLAY', e, null, 'warn'));
            } else {
                const box = this.map.getBoundingClientRect();
                const el = this.map.querySelector(MapUtilities.cleanCssSelector(`#${item.id}`));
                if (!item.model) { item.model = item.data || {}; }
                item.model.center = MapUtilities.getPosition(box, el, item.coordinates) || { x: .5, y: .5 };
                if (item.instance) { item.instance.set(item.model); }
            }
        }
        this.list = this.items;
    }

    /**
     * Remove overlay items that don't exist anymore
     */
    public clearItems(force: boolean = false) {
        for (const item of (this.list || [])) {
            let found = false;
            if (item.instance && !force){
                for (const new_itm of this.items) {
                    if (item.id === new_itm.id && item.cmp === new_itm.cmp) {
                        new_itm.exists = true;
                        new_itm.instance = item.instance;
                        if (!new_itm.model) { new_itm.model = new_itm.data || {}; }
                        new_itm.model.scale = this.scale;
                        if (new_itm.instance) { new_itm.instance.set(new_itm.model); }
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                this.remove(item.id);
            }
        }
    }
}
