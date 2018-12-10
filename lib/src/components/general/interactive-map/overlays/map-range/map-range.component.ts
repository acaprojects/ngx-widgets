
import { Component, ChangeDetectorRef } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

import { OverlayContentComponent } from '../../../../overlays/overlay-content.component';

@Component({
    selector: 'map-range',
    templateUrl: './map-range.template.html',
    styleUrls: ['./map-range.styles.scss'],
    animations: [
        trigger('show', [
            transition(':enter', [ style({ opacity: 0 }), animate(300, style({ opacity: 1 })) ]),
            transition(':leave', [ style({ opacity: 1 }), animate(300, style({ opacity: 0 })) ]),
        ]),
    ],
})
export class MapRangeComponent extends OverlayContentComponent {
    public static className() { return 'MapRangeComponent'; }
    public className() { return MapRangeComponent.className; }
    public size = 10;

    public init() {
        setTimeout(() => {
            if (this.model.bg) {
                this.model.bg_alpha = this.hexToRGB(this.model.bg, .2);
            }
        }, 100);
    }

    constructor(protected _cdr: ChangeDetectorRef) {
        super(_cdr);
    }

    public set(data: any) {
        super.set(data);
        this.size = (this.model.diameter || 10) * this.model.scale;
    }

    private hexToRGB(hex: string, alpha?: number) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
        } else {
            return 'rgb(' + r + ', ' + g + ', ' + b + ')';
        }
    }

}
