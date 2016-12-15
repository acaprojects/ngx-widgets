/**
* @Author: Alex Sorafumo
* @Date:   18/11/2016 4:15 PM
* @Email:  alex@yuion.net
* @Filename: index.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 15/12/2016 11:38 AM
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { COMPILER_PROVIDERS } from '@angular/compiler';

import { COMPONENTS, ENTRY_COMPONENTS } from './components';
import { DIRECTIVES } from './directives';
import { PIPES } from './pipes';
import { SERVICES } from './services';
import { ImageCropperModule } from './lib';

export * from './directives';
export * from './pipes';
export * from './services';
export * from './components';

@NgModule({
    declarations: [
        COMPONENTS,
        DIRECTIVES,
        PIPES,
        ENTRY_COMPONENTS
    ],
    imports: [ CommonModule, FormsModule, ImageCropperModule ],
    exports: [
        COMPONENTS,
        DIRECTIVES,
        PIPES
    ],
    entryComponents: [
        ENTRY_COMPONENTS
    ],
    providers: [
        SERVICES,
        //COMPILER_PROVIDERS
    ]
})
export class ACA_WIDGETS_MODULE {
    version: string = '0.5.3';
    build: string = 'dev-2016-12-15.v1';
    constructor() {
        console.debug(`ACA Angular 2 Widget Library - Version: ${this.version} | Build: ${this.build}`);
    }
}
