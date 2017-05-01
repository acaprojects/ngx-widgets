/**
* @Author: Alex Sorafumo
* @Date:   18/11/2016 4:15 PM
* @Email:  alex@yuion.net
* @Filename: index.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 01/02/2017 11:54 AM
*/

import { NgModule, ApplicationModule, Renderer } from '@angular/core';
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
export * from './helpers';

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
        SERVICES
        //COMPILER_PROVIDERS
    ]
})
export class WidgetsModule {
    version: string = '0.7.6';
    build: string = '2017-05-01.v1';
    static init: boolean = false;
    constructor() {
    	if(!WidgetsModule.init){
    		WidgetsModule.init = true;
	        console.debug(`[ACA][LIBRARY] Widgets - Version: ${this.version} | Build: ${this.build}`);
	    }
    }
}

export let ACA_WIDGETS_MODULE = WidgetsModule;

