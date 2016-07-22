import { Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import { ContentChildren, QueryList, AfterContentInit } from '@angular/core';

@Component({
    selector: 'tab-body',
    directives: [ ],
    template: `
        <div class="tab-body" *ngIf="visible">
            <ng-content></ng-content>
        </div>
    `
})
export class TabBody {
    @Input() id: string;
    contents: string;
    visible: boolean = false;
    constructor(private el: ElementRef) {
    }

    ngAfterContentInit(){
        this.contents = this.el.nativeElement.innerHTML;
    }

    show() {
        this.visible = true;
        return true;
    }

    hide() {
        this.visible = false;
        return false;
    }
    ngOnDestroy() {
        console.warn('Body Destroyed.');
    }
}
