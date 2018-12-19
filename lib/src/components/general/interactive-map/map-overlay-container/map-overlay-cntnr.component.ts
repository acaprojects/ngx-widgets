import { Component, Input, Output, EventEmitter, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';

import { OverlayContainerComponent } from '../../../overlays/overlay-container/overlay-container.component';

import { IMapPointOfInterest } from '../map.component';
import { MapUtilities } from '../map.utilities';
import { WIDGETS } from '../../../../settings';
import { MapService } from '../../../../services/map.service';

@Component({
    selector: 'map-overlay-container',
    template: `
        <div #el class="overlay-container">
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
    @Input() map: Element;
    @Input() scale: number;
    @Output() event = new EventEmitter();

    protected map_service: MapService;

    private model: any = {};

    public ngOnInit() {
        this.map_service = this.injector.get(MapService);
        super.ngOnInit();
        if (this.service) {
            this.service.registerContainer(this.id, this);
        }
    }

    public ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
        if (changes.items || changes.map) {
            this.clearItems(!!changes.map);
            this.timeout('update', () => this.updateItems(), 600);
        }
        if (changes.scale) {
            this.update();
        }
    }

    public update() {
        for (const item of (this.model.items || [])) {
            if (item.instance) {
                if (!item.model) { item.model = (item as any).data || {}; }
                item.model.scale = this.scale;
                item.instance.set(item.model);
            }
        }
    }

    /**
     * Render new overlay items on the container
     */
    public updateItems() {
        if (!this.map) {
            return this.timeout('update', () => this.updateItems());
        }
        for (const item of (this.items || [])) {
            if (!item.exists) {
                this.add(item.id, item.cmp).then((inst: any) => {
                    const box = this.map.getBoundingClientRect();
                    if (!item.model) { item.model = (item as any).data || {}; }
                    const el = item.id ? this.map.querySelector(MapUtilities.cleanCssSelector(`#${item.id}`)) : null;
                    if (el || item.coordinates) {
                        item.model.center = MapUtilities.getPosition(box, el, item.coordinates) || { x: .5, y: .5 };
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
                if (!item.model) { item.model = (item as any).data || {}; }
                item.model.center = MapUtilities.getPosition(box, el, item.coordinates) || { x: .5, y: .5 };
                if (item.instance) { item.instance.set(item.model); }
            }
        }
        this.model.items = this.items;
    }

    /**
     * Remove overlay items that don't exist anymore
     */
    public clearItems(force: boolean = false) {
        for (const item of (this.model.items || [])) {
            let found = false;
            if (item.instance && !force){
                for (const new_itm of this.items) {
                    if (item.id === new_itm.id && item.cmp === new_itm.cmp) {
                        new_itm.exists = true;
                        new_itm.instance = item.instance;
                        if (!new_itm.model) { new_itm.model = (new_itm as any).data || {}; }
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
