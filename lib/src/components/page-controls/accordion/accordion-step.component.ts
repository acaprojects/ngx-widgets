/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   24/11/2016 3:43 PM
 * @Email:  alex@yuion.net
 * @Filename: step.component.ts
 * @Last modified by:   alex.sorafumo
 * @Last modified time: 20/01/2017 3:45 PM
 */

import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'accordion-step',
    templateUrl: './accordion-step.template.html',
    styleUrls: ['./accordion-step.styles.scss'],
    animations: [
        trigger('view', [
            state('show', style({ opacity: 1, height: '*' })),
            state('hide', style({ opacity: 0, height: 0 })),
            transition('* => *', animate('0.2s ease-out')),
        ]),
    ],
})
export class AccordionStepComponent {
    @Input() public name = '';
    @Input() public show = false;
    @Input() public heading = '';
    @Input() public showChange = new EventEmitter();

    public model: any = {};

    public toggle(state?: boolean) {
        if (state === false || state === true) {
            this.show = state;
        } else {
            this.show = !this.show;
        }
        this.showChange.emit(this.show);
    }
}
