/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   24/11/2016 3:43 PM
 * @Email:  alex@yuion.net
 * @Filename: step.component.ts
 * @Last modified by:   alex.sorafumo
 * @Last modified time: 20/01/2017 3:45 PM
 */

import { Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import { AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'step',
    templateUrl: './step.template.html',
    styleUrls: ['./step.styles.scss'],
    animations: [
        trigger('showstep', [
            state('show',   style({ 'height': '*', 'padding-bottom' : '1.5em', 'overflow': 'visible' })),
            state('hide', style({ 'height': '0', 'padding-bottom' : '0', 'opacity': 0 })),
            transition('show <=> hide', animate('0.7s ease-in-out')),
        ]),
    ],
})
export class StepperStepComponent {
    @Input() public title = 'Step';
    @Input() public open = false;
    @Input() public active = false;
    @Input() public error = false;

    public index = 1;
    public ordered = true;
    public parent: any = null;

    private contents: string;

    constructor(private el: ElementRef) { }

    public ngAfterContentInit() {
        this.contents = this.el.nativeElement.innerHTML;
    }

    public toggle() {
        if (this.ordered) {
            this.show();
        } else {
            if (this.open) {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    public show() {
        this.open = true;
        this.parent.open(this.index);
        return true;
    }

    public hide() {
        this.open = false;
        this.parent.close(this.index);
        return false;
    }

    public setState(states?: any) {
        setTimeout(() => {
            this.open   = !states || !states.open   ? false : states.open;
            this.active = !states || !states.active ? false : states.active;
            this.error  = !states || !states.error  ? false : states.error;
        }, 20);
    }

}
