
import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { BaseWidgetComponent } from '../../../../../shared/base.component'
import { PointOfInterest } from '../../map-overlay-outlet/map-overlay-outlet.component';

@Component({
    selector: 'map-pin',
    templateUrl: './map-pin.template.html',
    styleUrls: ['./map-pin.styles.scss'],
    animations: [
        trigger('show', [
            transition(':enter', [
                style({ transform: 'translate(-50%, -100%)', opacity: 0 }),
                animate(300, style({ transform: 'translate(-50%, 0%)', opacity: 1 })),
            ]),
            transition(':leave', [style({ opacity: 1 }), animate(300, style({ opacity: 0 }))]),
        ]),
    ],
})
export class MapPinComponent extends BaseWidgetComponent {

    constructor(protected context: PointOfInterest) {
        super();
        console.log('Context:', context.data);
    }
}
