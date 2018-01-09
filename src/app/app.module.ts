import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WidgetsModule } from '../../lib/src/widgets.module';

import { AppComponent } from './app.component';
import { APP_COMPONENTS } from './shell';

import { ROUTES } from './app.routes';

@NgModule({
    declarations: [
        AppComponent,
        ...APP_COMPONENTS
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(ROUTES, { useHash: true }),
        WidgetsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
