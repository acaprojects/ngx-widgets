import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { COMPILER_PROVIDERS } from '@angular/compiler';

import { COMPONENTS, ENTRY_COMPONENTS } from './components';
import { DIRECTIVES } from './directives';
import { PIPES } from './pipes';
import { SERVICES } from './services';
import { ImageCropperComponent } from 'ng2-img-cropper';

export * from './directives';
export * from './pipes';
export * from './services';
export * from './components';

@NgModule({
    declarations: [
        COMPONENTS,
        DIRECTIVES,
        PIPES,
        ENTRY_COMPONENTS,
        ImageCropperComponent
    ],
    imports: [ CommonModule, FormsModule ],
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
    version: string = '0.5.1';
    build: string = 'dev-2016-10-24_5';
    constructor() {
        console.debug(`ACA Angular 2 Widget Library - Version: ${this.version} | Build: ${this.build}`);
    }
}
