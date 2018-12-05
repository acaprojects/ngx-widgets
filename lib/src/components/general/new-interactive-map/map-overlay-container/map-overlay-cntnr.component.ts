import { Component } from '@angular/core';

import { OverlayContainerComponent } from '../../../overlays/overlay-container/overlay-container.component';

@Component({
    selector: 'map-overlay-container',
    template: `<div #el class="overlay-container"><div><ng-container #content></ng-container></div></div>`,
    styles: [`.overlay-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        pointer-events: none;
        & > div {
            pointer-events: auto;
        }
    }`]
})
export class MapOverlayContainerComponent extends OverlayContainerComponent {

}
