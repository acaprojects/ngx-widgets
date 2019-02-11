import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { WidgetsModule } from '../../lib/src/widgets.module';

import { AppComponent } from './app.component';
import { APP_COMPONENTS } from './shell';
import { SHARED_COMPONENTS } from './shared/components';

import { ROUTES } from './app.routes';
import { DynamicFormComponentModule } from '../../lib/src/components/form-controls/dynamic-form/dynamic-form.module';

@NgModule({
    declarations: [
        AppComponent,
        ...APP_COMPONENTS,
        ...SHARED_COMPONENTS
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(ROUTES, { useHash: true }),
        WidgetsModule.forRoot(),
        DynamicFormComponentModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
