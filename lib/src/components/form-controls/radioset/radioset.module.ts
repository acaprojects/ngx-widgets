/**
 * @Author: Alex Sorafumo
 * @Date:   09/12/2016 9:39 AM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 06/02/2017 11:28 AM
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WidgetsSharedModule } from '../../../shared/shared.module';
import { DirectiveWidgetsModule } from '../../../directives/directives.module';

import { RadioButtonComponent } from './radio-button/radio-button.component';
import { RadiosetComponent } from './radioset.component';

const COMPONENTS: any[] = [
    RadioButtonComponent,
    RadiosetComponent
];

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [
        WidgetsSharedModule,
        CommonModule,
        FormsModule,
        DirectiveWidgetsModule
    ],
    exports: [
        ...COMPONENTS
    ],
    entryComponents: []
})
export class ARadiosetModule { }
