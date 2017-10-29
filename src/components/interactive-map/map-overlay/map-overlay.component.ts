
import { Component } from '@angular/core';
import { DynamicBaseComponent } from '../../overlays/dynamic-base.component';

@Component({
    selector: 'map-overlay',
    template: `<div class="map-overlay"
                    [style.top]="container?.top + '%'"
                    [style.left]="container?.left + '%'"
                    [style.width]="container?.width + '%'"
                    [style.height]="container?.height + '%'" [class.hide]="!this.model.el && !this.model.coordinates">
                        <ng-container #content></ng-container>
                </div>`,
    styleUrls: ['./map-overlay.styles.css'],
})
export class MapOverlayComponent extends DynamicBaseComponent {
    public container: any = {};

    public resize() {
        if (!this.model.map_state) {
            setTimeout(() => {
                this.resize();
            }, 200);
            return;
        }
        setTimeout(() => {
            const el = this.model.el;
            if (this.model.coordinates) {
                this.container = {
                    height: 1,
                    width: 1,
                    top: ((this.model.coordinates.y / 10000) / this.model.map_state.ratio.height) * 100,
                    left: ((this.model.coordinates.x / 10000) / this.model.map_state.ratio.width) * 100,
                };
            } else if (el) {
                const box = el.getBoundingClientRect();
                const map_box: any = this.model.map.getBoundingClientRect();
                this.container = {
                    height: (box.height / map_box.height) * 100,
                    width: (box.width / map_box.width) * 100,
                    top: ((box.top - map_box.top) / map_box.height) * 100,
                    left: ((box.left - map_box.left) / map_box.width) * 100,
                };
            }
        }, 100);
    }

    protected update(data: any) {
        this.resize();
        super.update(data);
    }
}
