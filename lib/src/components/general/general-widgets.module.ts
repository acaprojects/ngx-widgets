
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ImageCropComponent } from './img-crop/img-crop.component';
import { VirtualKeyboardComponent } from './virtual-keyboard/virtual-keyboard.component';

import { WidgetsPipeModule } from '../../pipes/pipe.module';
import { ASpinnerWidgetModule } from './spinner/spinner.module';
// import { FullCalendarWidgetModule } from './full-calendar/full-calendar.module';
import { FileDropModule } from '../../file-drop.module';
import { DirectiveWidgetsModule } from '../../directives/directives.module';
import { ButtonsModule } from './buttons/buttons.module';
import { AClickResponderModule } from './click-responder/click-responder.module';
import { AMediaPlayerModule } from './media-player/media-player.module';
import { AProgressCircleModule } from './progress-circle/progress-circle.module';
import { AnInteractiveMapModule } from './interactive-map/map.module';

const COMPONENTS: any[] = [
    ImageCropComponent,
    VirtualKeyboardComponent,
];

const COMPONENT_MODULES: any[] = [
    ButtonsModule,
    // MapWidgetsModule,
    ASpinnerWidgetModule,
    // FullCalendarWidgetModule
    AClickResponderModule,
    AMediaPlayerModule,
    AProgressCircleModule,
    AnInteractiveMapModule
]

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        WidgetsPipeModule,
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
