

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { DropTargetDirective } from './directives/drop-target.directive';
import { FileStreamDirective } from './directives/file-stream.directive';

@NgModule({
    declarations: [
        DropTargetDirective,
        FileStreamDirective
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule
    ],
    exports: [
        DropTargetDirective,
        FileStreamDirective
    ],
    entryComponents: [
    ]
})
export class FileDropModule {

}

export const ACA_FILE_DROP_MODULE = FileDropModule;

