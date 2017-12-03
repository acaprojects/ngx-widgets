/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   12/12/2016 10:41 AM
 * @Email:  alex@yuion.net
 * @Filename: stepper.component.ts
 * @Last modified by:   alex.sorafumo
 * @Last modified time: 20/01/2017 3:45 PM
 */

import { Location } from '@angular/common';
import { Component, DoCheck, ElementRef, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import { AfterContentInit, ContentChildren, QueryList, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { StepperStepComponent } from './step.component';

@Component({
    selector: 'stepper',
    template: `
        <div class="aca stepper" >
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
        .stepper {
            width: 100%;
        }
    `],
})
export class StepperComponent implements AfterContentInit, DoCheck, OnChanges  {

    @Input() public type = 'ordered';
    @Input() public direction = 'vertical';
    @Input() public steps: any = { count: 0, change: false, states: [] };
    @Output() public stepsChange = new EventEmitter();

    public last_change: any = null;

    @ContentChildren(StepperStepComponent) private stepList: QueryList<StepperStepComponent>;

    public ngOnChanges(changes: any) {
        if (changes.steps && this.steps && this.stepList) {
            this.updateStates();
        }
    }

    public ngDoCheck() {
        if (this.steps && this.steps.change !== this.last_change && this.stepList) {
            this.last_change = this.steps.change;
            this.updateStates();
        }
    }

    public updateStates() {
        const step_list = this.stepList.toArray();
        for (let i = 0; i < step_list.length; i++) {
            if (this.steps.states[i]) {
                step_list[i].setState(this.steps.states[i]);
            }
        }
    }

    public ngAfterContentInit() {
        this.initElements();
    }

    public initElements() {
        if (!this.steps) {
            return;
        }
        const step_list = this.stepList.toArray();
        for (let i = 0; i < step_list.length; i++) {
            if (i > this.steps.states.length) {
                this.steps.states.push({ open: false, active: false, error: false });
            }
            step_list[i].index = i;
            step_list[i].parent = this;
            if (this.type !== 'ordered') {
                step_list[i].ordered = false;
            }
            step_list[i].open = this.steps.states[i].open = (i === 0);
            step_list[i].active = this.steps.states[i].active = (i === 0);
        }
        this.stepsChange.emit(this.steps);
    }

    public open(index: number) {
        const step_list = this.stepList.toArray();
        this.steps.states[index].open = true;
        for (let i = 0; i < step_list.length; i++) {
            if (this.direction === 'ordered') {
                if (i === index) {
                    step_list[i].setState({ open: true, active: step_list[i].active, error: step_list[i].error });
                    this.steps.states[i].open = true;
                } else {
                    step_list[i].setState({ open: false, active: step_list[i].active, error: step_list[i].error });
                    this.steps.states[i].open = false;
                }
            }
        }
        this.stepsChange.emit(this.steps);
    }

    public close(index: number) {
        this.steps.states[index].open = false;
        this.stepsChange.emit(this.steps);
    }
}
