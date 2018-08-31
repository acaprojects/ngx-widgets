
import { Component, Injector, Renderer2 } from '@angular/core';
import { ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';

import { DynamicBaseComponent } from '../../../overlays/dynamic-base.component';

@Component({
    selector: 'map-overlay',
    template: `<div class="map-overlay"
                    [style.top]="container?.top + '%'"
                    [style.left]="container?.left + '%'"
                    [style.width]="container?.width + '%'"
                    [style.height]="container?.height + '%'" [class.hide]="!model.show">
                        <ng-container #content></ng-container>
                </div>`,
    styleUrls: ['./map-overlay.styles.scss'],
})
export class MapOverlayComponent extends DynamicBaseComponent {
    public container: any = {};

    constructor(private injector: Injector) {
        super();
        this._cfr = this.injector.get(ComponentFactoryResolver);
        this._cdr = this.injector.get(ChangeDetectorRef);
        this.renderer = this.injector.get(Renderer2);
        this.model.show = false;
    }

    public ngOnInit() {
        super.ngOnInit();
        this.id = `map-overlay-${Math.floor(Math.random() * 8999999 + 1000000)}`;
        setTimeout(() => this.checkShow(), 50);
    }

    public resize(tries: number = 0) {
        if (tries > 10) { return; }
        if (!this.model.map_state) {
            return setTimeout(() => this.resize(++tries), 50);
        }
        setTimeout(() => {
            const el = this.model.el;
            if (this.model.coordinates) {
                const view_box = this.model.map.getAttribute('viewBox').split(' ');
                const map_box: any = {
                    top: +view_box[1],
                    left: +view_box[0],
                    width: +view_box[2] - +view_box[0],
                    height: +view_box[3] - +view_box[1]
                };
                const ratio = map_box.width / map_box.height;
                const x = (this.model.coordinates.x / 10000);
                const y = (this.model.coordinates.y / 10000);
                this.container = {
                    height: 1,
                    width: 1,
                    top: y * ratio * 100,
                    left: x * 100,
                };
            } else if (el && this.model.map) {
                const box = el.getBoundingClientRect();
                const map_box = this.model.map.getBoundingClientRect();
                this.container = {
                    height: (box.height / map_box.height) * 100,
                    width: (box.width / map_box.width) * 100,
                    top: ((box.top - map_box.top) / map_box.height) * 100,
                    left: ((box.left - map_box.left) / map_box.width) * 100,
                };
            }
            this._cdr.markForCheck();
            this.checkShow();
        }, 20);
    }

    protected update(data: any) {
        if (data.coordinates !== this.model.coordinates || data.el !== this.model.el) {
            this.resize();
        }
        super.update(data);
    }

    private checkShow() {
        if (this.model.map_id && (this.model.el || this.model.coordinates) && this.container) {
            setTimeout(() => this.model.show = true, 300);
        }
    }

}
