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
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';

// import { COMPONENTS, ENTRY_COMPONENTS } from './components';
// import { DIRECTIVES } from './directives';
// import { PIPES } from './pipes';
// import { SERVICES } from './services';
import { WIDGETS } from './settings';

import 'hammerjs';

    // Directives
import { TapDownDirective } from './directives/tapdown.directive';
import { TapUpDirective } from './directives/tapup.directive';
    // Modules
import { FormControlWidgetsModule } from './components/form-controls/form-controls.module';
import { GeneralWidgetsModule } from './components/general/general-widgets.module';
import { OverlayWidgetsModule } from './components/overlays/overlay.module';
import { PageControlWidgetsModule } from './components/page-controls/page-controls.module';
import { WidgetsPipeModule } from './pipes/pipe.module';
import { FileDropModule } from './file-drop.module';

export class WidgetsHammerConfig extends HammerGestureConfig {
    overrides = {
        'pan':   { direction: 30 },
        'pinch': { enable: true },
    } as any;
}

@NgModule({
    declarations: [
        // ...DIRECTIVES,
        TapDownDirective,
        TapUpDirective,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        FormControlWidgetsModule,
        GeneralWidgetsModule,
        OverlayWidgetsModule,
        PageControlWidgetsModule,
        WidgetsPipeModule,
        FileDropModule
    ],
    exports: [
            // Export Directives
        TapDownDirective,
        TapUpDirective,
            // Export Modules
        FormControlWidgetsModule,
        GeneralWidgetsModule,
        OverlayWidgetsModule,
        PageControlWidgetsModule,
        WidgetsPipeModule,
        FileDropModule
    ],
    entryComponents: []
})
export class WidgetsModule {
    private static init = false;
    private build = '2018-06-14.v3';

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
