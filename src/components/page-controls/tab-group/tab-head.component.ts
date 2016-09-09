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
