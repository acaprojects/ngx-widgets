
import { NgModule } from '@angular/core';

import { TouchReleaseDirective } from './touchrelease.directive';
import { TouchPressDirective } from './touchpress.directive';
import { DraggableDirective } from './drag-n-drop/draggable.directive';
import { DropzoneDirective } from './drag-n-drop/dropzone.directive';

@NgModule({
    declarations: [
        TouchPressDirective,
        TouchReleaseDirective,
        DraggableDirective,
        DropzoneDirective
    ],
    exports: [
        TouchPressDirective,
        TouchReleaseDirective,
        DraggableDirective,
        DropzoneDirective
    ]
})
export class DirectiveWidgetsModule { }
