
import { NgModule } from '@angular/core';

import { TouchReleaseDirective } from './touchrelease.directive';
import { TouchPressDirective } from './touchpress.directive';
import { DraggableDirective } from './drag-n-drop/draggable.directive';
import { DropzoneDirective } from './drag-n-drop/dropzone.directive';

const DIRECTIVES: any[] = [
    TouchPressDirective,
    TouchReleaseDirective,
    DraggableDirective,
    DropzoneDirective
];

@NgModule({
    declarations: [
        ...DIRECTIVES
    ],
    exports: [
        ...DIRECTIVES
    ]
})
export class DirectiveWidgetsModule { }
