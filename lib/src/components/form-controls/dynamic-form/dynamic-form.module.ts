
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TextFieldModule} from '@angular/cdk/text-field';

import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormFieldComponent } from './dynamic-field/dynamic-field.component';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { WidgetsSharedModule } from '../../../shared/shared.module';
import { ADropdownModule } from '../dropdown/dropdown.module';
import { AToggleModule } from '../toggle/toggle.module';
import { ASliderModule } from '../slider/slider.module';

const COMPONENTS: any[] = [
    DynamicFormComponent,
    DynamicFormFieldComponent,
    CustomFieldComponent,
];

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextFieldModule,
        ADropdownModule,
        AToggleModule,
        ASliderModule,
        WidgetsSharedModule
    ],
    exports: [
        ...COMPONENTS
    ]
})
export class DynamicFormComponentModule { }
