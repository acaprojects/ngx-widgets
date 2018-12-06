

/**
 * @Author: Alex Sorafumo
 * @Date:   09/12/2016 9:39 AM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 06/02/2017 11:28 AM
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WidgetsSharedModule } from '../../../shared/shared.module';
import { DirectiveWidgetsModule } from '../../../directives/directives.module';
import { WidgetsPipeModule } from '../../../pipes/pipe.module';
import { ASpinnerWidgetModule } from '../spinner/spinner.module';

import { MapComponent } from './map.component';
import { MapInputDirective } from './map-input.directive';
import { MapStylerDirective } from './map-styler.directive';
import { MapRendererComponent } from './map-renderer/map-renderer.component';
import { MapOverlayContainerComponent } from './map-overlay-container/map-overlay-cntnr.component';


const COMPONENTS: any[] = [
    MapComponent,
    MapInputDirective,
    MapStylerDirective,
    MapRendererComponent,
    MapOverlayContainerComponent
];

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [
        WidgetsSharedModule,
        CommonModule,
        FormsModule,
        WidgetsPipeModule,
        DirectiveWidgetsModule,
        ASpinnerWidgetModule
    ],
    exports: [
        ...COMPONENTS
    ],
    entryComponents: []
})
export class AnInteractiveMapModule { }
