
import { Component } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';

import { OverlayContentComponent } from '../../../overlays/contents/overlay-content.component';

@Component({
    selector: 'map-tooltip',
    templateUrl: './map-tooltip.template.html',
    styleUrls: ['./map-tooltip.styles.css'],
    animations: [
        trigger('show', [
            transition(':enter', [ style({ opacity: 0 }), animate(300, style({ opacity: 1 })) ]),
            transition(':leave', [ style({ opacity: 1 }), animate(300, style({ opacity: 0 })) ]),
        ]),
    ],
})
export class MapTooltipComponent extends OverlayContentComponent {

    // TODO
}
