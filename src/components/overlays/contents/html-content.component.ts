
import { Component } from '@angular/core';

import { OverlayContentComponent } from './overlay-content.component';

@Component({
    selector: 'html-contents',
    template: `<div [class]="'html-contents ' + model.name" widget [innerHTML]="(model.html || 'No content') | safe"></div>`,
    styles: ['.html-contents { padding: .25em .5em; }'],
})
export class HTMLContentComponent extends OverlayContentComponent {

}
