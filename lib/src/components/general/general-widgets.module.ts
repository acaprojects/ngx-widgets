
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClickResponderComponent } from './click-responder/click-responder.component';
import { ImageCropComponent } from './img-crop/img-crop.component';
import { MediaPlayerComponent } from './media-player/media-player.component';
import { ProgressCircleComponent } from './progress-circle/progress-circle.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { VirtualKeyboardComponent } from './virtual-keyboard/virtual-keyboard.component';

import { MapWidgetsModule } from './interactive-map/map-widget.module';
import { WidgetsPipeModule } from '../../pipes/pipe.module';
import { SpinnerWidgetModule } from './spinner/spinner.module';
// import { FullCalendarWidgetModule } from './full-calendar/full-calendar.module';
import { FileDropModule } from '../../file-drop.module';
import { DirectiveWidgetsModule } from '../../directives/directives.module';
import { ButtonsModule } from './buttons/buttons.module';
import { AClickResponderModule } from './click-responder/click-responder.module';

const COMPONENTS: any[] = [
    ImageCropComponent,
    MediaPlayerComponent,
    ProgressCircleComponent,
    VirtualKeyboardComponent,
];

const COMPONENT_MODULES: any[] = [
    ButtonsModule,
    MapWidgetsModule,
    SpinnerWidgetModule,
    // FullCalendarWidgetModule
    AClickResponderModule
]

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        MapWidgetsModule,
        WidgetsPipeModule,
        SpinnerWidgetModule,
        FileDropModule,
        DirectiveWidgetsModule,
        ...COMPONENT_MODULES
    ],
    exports: [
        ...COMPONENTS,
        ...COMPONENT_MODULES
    ],
    entryComponents: []
})
export class GeneralWidgetsModule { }

export const ACA_GENERAL_WIDGETS_MODULE = GeneralWidgetsModule;
