
import { NgModule } from '@angular/core';

import { TouchReleaseDirective } from './touchrelease.directive';
import { TouchPressDirective } from './touchpress.directive';

@NgModule({
    declarations: [
        TouchPressDirective,
        TouchReleaseDirective
    ],
    exports: [
        TouchPressDirective,
        TouchReleaseDirective
    ]
})
export class DirectiveWidgetsModule { }
