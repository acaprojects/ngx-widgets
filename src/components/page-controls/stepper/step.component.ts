/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   24/11/2016 3:43 PM
* @Email:  alex@yuion.net
* @Filename: step.component.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:31 AM
*/

import { Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import { ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';

@Component({
    selector: 'step',
    templateUrl: './step.template.html',
    styleUrls: ['./step.styles.css'],
    animations: [
        trigger('showstep', [
            state('show',   style({ 'height': '*', 'padding-bottom' : '1.5em', overflow: 'visible' })),
            state('hide', style({ 'height': '0', 'padding-bottom' : '0', opacity: 0 })),
            transition('show <=> hide', animate('0.7s ease-in-out'))
        ])
    ]
})
export class StepperStep {
    @Input() title: string = 'Step';
    @Input() open: boolean = false;
    @Input() active: boolean = false;
    @Input() error: boolean = false;
    index: number = 1;
    ordered: boolean = true;
    parent: any = null;

    contents: string;
    constructor(private el: ElementRef) {
    }

    ngOnChanges(changes: any) {

    }

    ngAfterContentInit(){
        this.contents = this.el.nativeElement.innerHTML;
    }

    toggle() {
        if(this.ordered) {
            this.show()
        } else {
            if(this.open) this.hide();
            else this.show();
        }
    }

    show() {
        this.open = true;
        this.parent.open(this.index);
        return true;
    }

    hide() {
        this.open = false;
        this.parent.close(this.index);
        return false;
    }

    setState(states?:any) {
        setTimeout(() => {
            this.open   = !states || !states.open   ? false : states.open;
            this.active = !states || !states.active ? false : states.active;
            this.error  = !states || !states.error  ? false : states.error;
        }, 20);
    }

    ngOnDestroy() {
        console.warn('Step Destroyed.');
    }
}
