
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TimePickerComponent } from './time-picker/time-picker.component';
import { ToggleComponent } from './toggle/toggle.component';
import { TimeInputComponent } from './time-input/time-input.component';

import { OverlayWidgetsModule } from '../overlays/overlay.module';
import { WidgetsPipeModule } from '../../pipes/pipe.module';
import { DirectiveWidgetsModule } from '../../directives/directives.module';

import { ACalendarModule } from './calendar/calendar.module';
import { ACheckboxModule } from './checkbox/checkbox.module';
import { ACustomDropdownModule } from './custom-dropdown/custom-dropdown.module';
import { ADropdownModule } from './dropdown/dropdown.module';
import { AnInputFieldModule } from './input-field/input-field.module';
import { ARadiosetModule } from './radioset/radioset.module';
import { ASliderModule } from './slider/slider.module';
import { ATimeInputModule } from './time-input/time-input.module';

const COMPONENTS: any[] = [
    TimePickerComponent,
    ToggleComponent
];

const COMPONENT_MODULES: any[] = [
    ACalendarModule,
    ACheckboxModule,
    ACustomDropdownModule,
    ADropdownModule,
    AnInputFieldModule,
    ARadiosetModule,
    ASliderModule,
    ATimeInputModule
]

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        OverlayWidgetsModule,
        WidgetsPipeModule,
        DirectiveWidgetsModule,
        ...COMPONENT_MODULES
    ],
    exports: [
        ...COMPONENTS,
        ...COMPONENT_MODULES
    ]
})
export class FormControlWidgetsModule {

}

export const ACA_FORM_CONTROL_WIDGETS_MODULE = FormControlWidgetsModule;
