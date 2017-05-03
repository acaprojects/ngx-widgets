/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: tab-head.component.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:32 AM
*/

import { Component, Input, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { ContentChildren, QueryList, AfterContentInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'tab-head',
    template: `
    <div *ngIf="visible" [class]="'tab-head ' + cssClass" [class.active]="isActive" (tap)="tapped()">
        <ng-content></ng-content>
    </div>
    `,
    styleUrls: ['./tab-head.styles.css']
})
export class TabHead {
    @Input() id: string;
    @Input() cssClass: string = 'default';

    contents: string;
    isActive: boolean = false;
    visible: boolean = true;
    tap_observer: any = null;
    tap_obs: any = null;

    constructor(private el: ElementRef) {
        this.tap_observer = new Observable((observer) => {
            this.tap_obs = observer;
        });
    }

    get activeTab() {
        return this.isActive;
    }

    public active(){
        this.isActive = true;
    }

    public inactive(){
        this.isActive = false;
    }

    show() {
        this.visible = true;
        return true;
    }

    hide() {
        this.visible = false;
        return false;
    }

    nativeElement() {
        return this.el.nativeElement;
    }

    tapped() {
        this.tap_obs.next(this.id);
    }

    listen() {
        return this.tap_observer;
    }
}
