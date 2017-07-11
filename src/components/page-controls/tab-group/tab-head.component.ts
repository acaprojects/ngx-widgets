/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: tab-head.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:32 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, Renderer } from '@angular/core';
import { AfterContentInit, ContentChildren, QueryList, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'tab-head',
    template: `
    <div *ngIf="visible" [class]="'tab-head ' + cssClass" [class.active]="isActive" (tap)="tapped()">
        <ng-content></ng-content>
    </div>
    `,
    styleUrls: ['./tab-head.styles.css'],
})
export class TabHead {
    @Input() public id: string;
    @Input() public cssClass: string = 'default';
    public parent: any = true;
    public visible: boolean = true;

    private contents: string;
    private isActive: boolean = false;
    private tap_observer: any = null;
    private tap_obs: any = null;

    constructor(private el: ElementRef) {
        this.tap_observer = new Observable((observer) => {
            this.tap_obs = observer;
        });
    }

    get activeTab() {
        return this.isActive;
    }

    public active() {
        this.isActive = true;
        this.el.nativeElement.scrollIntoView();
    }

    public inactive() {
        this.isActive = false;
    }

    public show() {
        setTimeout(() => {
            this.visible = true;
        }, 100);
    }

    public hide() {
        this.visible = false;
        return false;
    }

    public nativeElement() {
        return this.el.nativeElement;
    }

    public tapped() {
        this.parent.setActiveTab(this.id);
    }

    public listen() {
        return this.tap_observer;
    }
}
