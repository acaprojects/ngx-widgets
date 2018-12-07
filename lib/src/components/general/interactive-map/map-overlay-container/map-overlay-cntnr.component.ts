import { Component, Input, Output, EventEmitter } from '@angular/core';

import { OverlayContainerComponent } from '../../../overlays/overlay-container/overlay-container.component';

import { IMapPointOfInterest } from '../map.component';
import { MapUtilities } from '../map.utilities';

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
    @Output() event = new EventEmitter();

    private model: any = {};

    public ngOnInit() {
        super.ngOnInit();
        if (this.service) {
            this.service.registerContainer(this.id, this);
        }
    }

    public ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
        if (changes.items) {
            this.updateItems();
        }
    }

    /**
     * Render new overlay items on the container
     */
    public updateItems() {
        if (!this.map) {
            return this.timeout('update', () => this.updateItems());
        }
        this.clearItems();
        for (const item of (this.items || [])) {
            if (!item.exists) {
                this.add(item.id, item.cmp).then((inst: any) => {
                    const box = this.map.getBoundingClientRect();
                    if (!item.model) { item.model = (item as any).data || {}; }
                    item.model.center = MapUtilities.getPosition(box, this.map.querySelector(`#${item.id}`), item.coordinates) || { x: .5, y: .5 };
                    item.instance = inst;
                    inst.set(item.model);
                    inst.fn = {
                        event: (e) => this.event.emit({ id: item.id, type: 'overlay', item, details: event }),
                        close: () => {
                            this.event.emit({ id: item.id, type: 'overlay', item, details: { type: 'close' } });
                            this.remove(item.id);
                        }
                    };
                });
            }
        }
        this.model.items = this.items;
    }

    /**
     * Remove overlay items that don't exist anymore
     */
    public clearItems() {
        for (const item of (this.model.items || [])) {
            let found = false;
            for (const new_itm of this.items) {
                if (item.id === new_itm.id && item.cmp === new_itm.cmp) {
                    new_itm.exists = true;
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.remove(item.id);
            }
        }
    }
}
