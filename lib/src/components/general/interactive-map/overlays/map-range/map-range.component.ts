
import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { BaseWidgetComponent } from '../../../../../shared/base.component';
import { PointOfInterest } from '../../map-overlay-outlet/map-overlay-outlet.component';

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
export class MapRangeComponent extends BaseWidgetComponent {
    public size = 10;
    public diameter = 16;
    public context: PointOfInterest;

    constructor(context: PointOfInterest) {
        super();
        this.context = context;
        this.size = (context.data as any).size || 10;
        this.subs.obs.changes = context.listen.subscribe((scale) => {
            this.diameter = (scale || 1) * ((context.data as any).diameter || 16);
        });
    }
}
