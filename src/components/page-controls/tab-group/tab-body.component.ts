/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: tab-body.component.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:32 AM
*/

import { Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import { ContentChildren, QueryList, AfterContentInit } from '@angular/core';

@Component({
    selector: 'tab-body',
    template: `
        <div [class]="'tab-body ' + cssClass" *ngIf="visible">
            <ng-content></ng-content>
        </div>
    `
})
export class TabBody {
    @Input() id: string;
    @Input() cssClass: string = 'default';
    visible: boolean = false;

    constructor(private el: ElementRef) {

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

    ngOnDestroy() {
        console.warn('Body Destroyed.');
    }
}
