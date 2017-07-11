/**
 * @Author: Alex Sorafumo
 * @Date:   18/11/2016 4:15 PM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 01/02/2017 11:54 AM
 */

import { CommonModule } from '@angular/common';
import { COMPILER_PROVIDERS } from '@angular/compiler';
import { ApplicationModule, NgModule, Renderer } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ImageCropperModule } from 'ng2-img-cropper';

import { COMPONENTS, ENTRY_COMPONENTS } from './components';
import { DIRECTIVES } from './directives';
import { PIPES } from './pipes';
import { SERVICES } from './services';
import { WIDGETS } from './settings';

export * from './directives';
export * from './pipes';
export * from './services';
export * from './components';
export * from './shared';

import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import * as hammer from 'hammerjs';

export class MyHammerConfig extends HammerGestureConfig {
    overrides = {
        'pan': { direction: hammer.DIRECTION_ALL }
    } as any;
};


@NgModule({
    declarations: [
        COMPONENTS,
        DIRECTIVES,
        PIPES,
        ENTRY_COMPONENTS,
    ],
    imports: [ CommonModule, FormsModule, ImageCropperModule ],
    exports: [
        COMPONENTS,
        DIRECTIVES,
        PIPES,
    ],
    entryComponents: [
        ENTRY_COMPONENTS,
    ],
    providers: [
        SERVICES,
        // COMPILER_PROVIDERS
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig
        },
    ],
})
export class WidgetsModule {
    private static init: boolean = false;

    private version: string = '0.8.6';
    private build: string = '2017-07-05.v1';

    constructor() {
        if (!WidgetsModule.init) {
            WidgetsModule.init = true;
            WIDGETS.version(this.version, this.build);
        }
    }
}

export let ACA_WIDGETS_MODULE = WidgetsModule;
