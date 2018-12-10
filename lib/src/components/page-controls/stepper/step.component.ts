/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   24/11/2016 3:43 PM
 * @Email:  alex@yuion.net
 * @Filename: step.component.ts
 * @Last modified by:   alex.sorafumo
 * @Last modified time: 20/01/2017 3:45 PM
 */

import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output} from '@angular/core';

import { StepperComponent } from './stepper.component';
import { BaseWidgetComponent } from '../../../shared/base.component';

@Component({
    selector: 'stepper-step',
    templateUrl: './step.template.html',
    styleUrls: ['./step.styles.scss'],
    animations: [
        trigger('show', [
            transition('void => horz', [
                style({ opacity: 0, left: 0, top: 0, position: 'absolute', transform: 'translateX(100%)' }),
                animate(300, style({ opacity: 1, left: 0, top: 0, position: 'absolute', transform: 'translateX(0%)' }))
            ]),
            transition('horz => void', [
                style({ opacity: 1, left: 0, top: 0, position: 'absolute', transform: 'translateX(0%)' }),
                animate(300, style({ opacity: 0, left: 0, top: 0, position: 'absolute', transform: 'translateX(-100%)' }))
            ]),
            transition('void => horz-reverse', [
                style({ opacity: 0, right: 0, top: 0, position: 'absolute', transform: 'translateX(-100%)' }),
                animate(300, style({ opacity: 1, right: 0, top: 0, position: 'absolute', transform: 'translateX(0%)' }))
            ]),
            transition('horz-reverse => void', [
                style({ opacity: 1, right: 0, top: 0, position: 'absolute', transform: 'translateX(0%)' }),
                animate(300, style({ opacity: 0, right: 0, top: 0, position: 'absolute', transform: 'translateX(100%)' }))
            ]),
            transition('void => vert', [
                style({ opacity: 0, left: 0, top: 0, position: 'absolute', transform: 'translateY(100%)' }),
                animate(300, style({ opacity: 1, left: 0, top: 0, position: 'absolute', transform: 'translateY(0%)' }))
            ]),
            transition('vert => void', [
                style({ opacity: 1, left: 0, top: 0, position: 'absolute', transform: 'translateY(0%)' }),
                animate(300, style({ opacity: 0, left: 0, top: 0, position: 'absolute', transform: 'translateY(-100%)' }))
            ]),
            transition('void => vert-reverse', [
                style({ opacity: 0, left: 0, top: 0, position: 'absolute', transform: 'translateY(-100%)' }),
                animate(300, style({ opacity: 1, left: 0, top: 0, position: 'absolute', transform: 'translateY(0%)' }))
            ]),
            transition('vert-reverse => void', [
                style({ opacity: 1, left: 0, top: 0, position: 'absolute', transform: 'translateY(0%)' }),
                animate(300, style({ opacity: 0, left: 0, top: 0, position: 'absolute', transform: 'translateY(100%)' }))
            ]),
        ])
    ]
})
export class StepperStepComponent extends BaseWidgetComponent {
    @Input() public heading = '';
    @Input() public state = '';
    @Output() public stateChange = new EventEmitter();

    public parent: StepperComponent = null;
    public model: any = {};

    constructor() {
        super();
        this.model.direction = 'horz';
    }

    public setActive(state: boolean) {
        if (this.state && this.state !== 'active') {
            this.model.state = this.state;
        }
        this.state = state ? 'active' : this.model.state;
    }
}
