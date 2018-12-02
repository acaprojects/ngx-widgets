

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SpinnerComponent } from './spinner.component';

@NgModule({
    declarations: [
        SpinnerComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule
    ],
    exports: [
        SpinnerComponent
    ],
    entryComponents: [
    ]
})
export class ASpinnerWidgetModule { }

