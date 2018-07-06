/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   12/12/2016 10:41 AM
 * @Email:  alex@yuion.net
 * @Filename: stepper.component.ts
 * @Last modified by:   alex.sorafumo
 * @Last modified time: 20/01/2017 3:45 PM
 */

import { Component, EventEmitter, Input, Output, QueryList, ContentChildren} from '@angular/core';

import { StepperStepComponent } from './step.component';

@Component({
    selector: 'stepper',
    templateUrl: `./stepper.template.html`,
    styleUrls: [`./stepper.styles.scss`],
})
export class StepperComponent {
    @Input() public name = '';
    @Input() public step = 0;
    @Input() public numbers = true;
    @Input() public format: 'horizontal' | 'vertical' | 'vert' | 'horz' = 'horizontal';
    @Output() public stepChange = new EventEmitter();

    @ContentChildren(StepperStepComponent) private steps: QueryList<StepperStepComponent>;

    public step_list: any[] = [];

    public ngAfterContentInit() {
        this.update();
    }

    public update() {
        if (this.steps) {
            const items = this.steps.toArray();
            this.step_list = [...items];
            for (const step of this.step_list) {
                step.parent = this;
            }
            this.toStep(this.step, false);
        }
    }

    public toStep(index: number, change: boolean = true) {
        const reverse = index < this.step;
        const dir = `${this.format === 'vertical' ? 'vert' : 'horz'}${reverse ? '-reverse' : ''}`;
        for (let i = 0; i < this.step_list.length; i++) {
            this.step_list[i].model.direction = dir;
        }
        setTimeout(() => {
            for (let i = 0; i < this.step_list.length; i++) {
                this.step_list[i].setActive(i === index);
            }
        }, 10);
        this.step = index;
        if (change) {
            this.stepChange.emit(index);
        }
    }
}
