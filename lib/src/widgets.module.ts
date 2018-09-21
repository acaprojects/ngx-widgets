/**
 * @Author: Alex Sorafumo
 * @Date:   09/12/2016 9:39 AM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 06/02/2017 11:28 AM
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';

import { WIDGETS } from './settings';

import 'hammerjs';

    // Modules
import { FormControlWidgetsModule } from './components/form-controls/form-controls.module';
import { GeneralWidgetsModule } from './components/general/general-widgets.module';
import { OverlayWidgetsModule } from './components/overlays/overlay.module';
import { PageControlWidgetsModule } from './components/page-controls/page-controls.module';
import { WidgetsPipeModule } from './pipes/pipe.module';
import { FileDropModule } from './file-drop.module';
import { DirectiveWidgetsModule } from './directives/directives.module';

export class WidgetsHammerConfig extends HammerGestureConfig {
    overrides = {
        'pan':   { direction: 30 },
        'pinch': { enable: true },
    } as any;
}

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        FormControlWidgetsModule,
        GeneralWidgetsModule,
        OverlayWidgetsModule,
        PageControlWidgetsModule,
        WidgetsPipeModule,
        FileDropModule,
        DirectiveWidgetsModule
    ],
    exports: [
            // Export Modules
        FormControlWidgetsModule,
        GeneralWidgetsModule,
        OverlayWidgetsModule,
        PageControlWidgetsModule,
        WidgetsPipeModule,
        FileDropModule,
        DirectiveWidgetsModule
    ],
    entryComponents: []
})
export class WidgetsModule {
    private static init = false;
    private build = '2018-09-21.v1';

    constructor() {
        if (!WidgetsModule.init) {
            WidgetsModule.init = true;
            WIDGETS.version(this.build);
        }
    }

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: WidgetsModule,
            providers: [
                {
                    provide: HAMMER_GESTURE_CONFIG,
                    useClass: WidgetsHammerConfig
                }
            ]
        };
    }
}

export const ACA_WIDGETS_MODULE = WidgetsModule;
