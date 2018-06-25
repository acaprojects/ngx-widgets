
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { InteractiveMapComponent } from './map.component';
import { MapInputDirective } from '../../../directives/map-input.directive';
import { MapOverlayComponent } from './map-overlay/map-overlay.component';
import { MapOverlayContainerComponent } from './map-overlay-container/map-overlay-container.component';
import { MapPinComponent } from './overlay-components/map-pin/map-pin.component';
import { MapRangeComponent } from './overlay-components/map-range/map-range.component';
import { MapTooltipComponent } from './overlay-components/map-tooltip/map-tooltip.component';

import { OverlayWidgetsModule } from '../../overlays/overlay.module';
import { WidgetsPipeModule } from '../../../pipes/pipe.module';
import { SpinnerWidgetModule } from '../spinner/spinner.module';


@NgModule({
    declarations: [
        InteractiveMapComponent,
        MapInputDirective,
        MapOverlayComponent,
        MapOverlayContainerComponent,
        MapPinComponent,
        MapRangeComponent,
        MapTooltipComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        OverlayWidgetsModule,
        WidgetsPipeModule,
        SpinnerWidgetModule
    ],
    exports: [
        InteractiveMapComponent,
        MapPinComponent,
        MapRangeComponent,
        MapTooltipComponent
    ],
    entryComponents: [
        MapOverlayComponent,
        MapOverlayContainerComponent,
        MapPinComponent,
        MapRangeComponent,
        MapTooltipComponent
    ]
})
export class MapWidgetsModule {

}

export const ACA_MAP_WIDGETS_MODULE = MapWidgetsModule;
