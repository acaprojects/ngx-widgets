
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CalendarComponent } from './calendar/calendar.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { CustomDropdownComponent } from './custom-dropdown/custom-dropdown.component';
import { DropdownComponent } from './dropdown/dropdown.component';
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

const COMPONENTS: any[] = [
    CalendarComponent,
    CheckboxComponent,
    CustomDropdownComponent,
    DropdownComponent,
    InputFieldComponent,
    RadiosetComponent,
    RadioButtonComponent,
    SliderComponent,
    TimePickerComponent,
    ToggleComponent,
    TimeInputComponent
];

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
        DirectiveWidgetsModule
    ],
    exports: [
        ...COMPONENTS
    ]
})
export class FormControlWidgetsModule {

}

export const ACA_FORM_CONTROL_WIDGETS_MODULE = FormControlWidgetsModule;
