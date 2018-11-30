/**
 * @Author: Alex Sorafumo
 * @Date:   09/12/2016 9:39 AM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 06/02/2017 11:28 AM
 */

import { NgModule } from '@angular/core';

import { BaseWidgetComponent } from './base.component';

const COMPONENTS: any[] = [
    BaseWidgetComponent
];

@NgModule({
    declarations: [
        ...COMPONENTS
    ],
    imports: [],
    exports: [
        ...COMPONENTS
    ],
    entryComponents: []
})
export class WidgetsSharedModule { }
