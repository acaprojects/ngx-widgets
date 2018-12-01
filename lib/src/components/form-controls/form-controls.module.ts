
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputFieldComponent } from './input-field/input-field.component';
import { RadiosetComponent } from './radioset/radioset.component';
import { RadioButtonComponent } from './radioset/radio-button/radio-button.component';
import { SliderComponent } from './slider/slider.component';
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

const COMPONENTS: any[] = [
    InputFieldComponent,
    RadiosetComponent,
    RadioButtonComponent,
    SliderComponent,
    TimePickerComponent,
    ToggleComponent,
    TimeInputComponent
];

const COMPONENT_MODULES: any[] = [
    ACalendarModule,
    ACheckboxModule,
    ACustomDropdownModule,
    ADropdownModule
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
