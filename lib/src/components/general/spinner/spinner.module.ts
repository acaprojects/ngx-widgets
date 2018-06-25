

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { SpinnerComponent } from './spinner.component';

@NgModule({
    declarations: [
        SpinnerComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule
    ],
    exports: [
        SpinnerComponent
    ],
    entryComponents: [
    ]
})
export class SpinnerWidgetModule {

}

export const ACA_SPINNER_WIDGET_MODULE = SpinnerWidgetModule;

