import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';

import * as hljs from 'highlight.js';

import { AppService } from './services/app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    constructor(private view: ViewContainerRef, private service: AppService) {
        hljs.initHighlightingOnLoad();
        this.service.Overlay.view = view;
    }
}
