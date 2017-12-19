/**
 * @Author: Alex Sorafumo
 * @Date:   09/12/2016 9:39 AM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 06/02/2017 11:28 AM
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { COMPONENTS, ENTRY_COMPONENTS } from './components';
import { DIRECTIVES } from './directives';
import { PIPES } from './pipes';
import { SERVICES } from './services';
import { WIDGETS } from './settings';

export * from './components';
export * from './directives';
export * from './pipes';
export * from './services';

@NgModule({
    declarations: [
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES,
        ...ENTRY_COMPONENTS,
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES,
        ...ENTRY_COMPONENTS,
    ],
    entryComponents: [
        ...ENTRY_COMPONENTS,
    ],
    providers: [
        ...SERVICES,
    ],
})
export class WidgetsModule {
    private static init: boolean = false;
    private version: string = '0.14.0-beta.6';
    private build: string = '2017-12-20.v1';

    constructor() {
        if (!WidgetsModule.init) {
            WidgetsModule.init = true;
            WIDGETS.version(this.version, this.build);
        }
    }
}

export let ACA_WIDGETS_MODULE = WidgetsModule;
