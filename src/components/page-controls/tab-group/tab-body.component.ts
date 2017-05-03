/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: tab-body.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:32 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import { AfterContentInit, ContentChildren, QueryList } from '@angular/core';

@Component({
    selector: 'tab-body',
    template: `
        <div [class]="'tab-body ' + cssClass" *ngIf="visible">
            <ng-content></ng-content>
        </div>
    `,
})
export class TabBody {
    @Input() public id: string;
    @Input() public cssClass: string = 'default';

    public visible: boolean = false;

    constructor(private el: ElementRef) {

    }

    public show() {
        this.visible = true;
        return true;
    }

    public hide() {
        this.visible = false;
        return false;
    }

    public nativeElement() {
        return this.el.nativeElement;
    }
}
