/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: tab-head.component.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:32 AM
*/

import { Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import { ContentChildren, QueryList, AfterContentInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'tab-head',
    template: `
    <div class="tab-head">
        <ng-content></ng-content>
    </div>
    `,
    encapsulation: ViewEncapsulation.None
})
export class TabHead {
    @Input() id: string;
    contents: string;
    isActive: boolean = false;
    visible: boolean = false;
    constructor(private el: ElementRef) {
    }

    ngAfterContentInit(){
        this.contents = this.el.nativeElement.innerHTML;
        this.el.nativeElement.innerHTML = "";
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
}
