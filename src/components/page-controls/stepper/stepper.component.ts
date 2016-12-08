import { Component, Input, Output, EventEmitter, ElementRef, DoCheck, OnChanges} from '@angular/core';
import { ViewChild, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { StepperStep } from './step.component';

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
    `]
})
export class Stepper implements AfterContentInit, DoCheck, OnChanges  {

    @Input() type: string = "ordered";
    @Input() direction: string = 'vertical';
    @Input() steps: any = { count: 0, change: false, states: [] };
    @Output() stepsChange = new EventEmitter();
    last_change: any = null;

    @ContentChildren(StepperStep) stepList: QueryList<StepperStep>;

    constructor() {
    }

    ngOnChanges(changes: any) {
        if(changes.steps && this.steps && this.stepList) {
            this.updateStates();
        }
    }

    ngDoCheck() {
        if(this.steps && this.steps.change !== this.last_change && this.stepList) {
            console.log(this.steps.states);
            this.last_change = this.steps.change;
            this.updateStates();
        }
    }

    updateStates() {
        let step_list = this.stepList.toArray();
        for(let i = 0; i < step_list.length; i++) {
            if(this.steps.states[i]) {
                step_list[i].setState(this.steps.states[i]);
            }
        }
    }

    ngAfterContentInit(){
        this.initElements();
    }

    initElements(){
        if(!this.steps) return;
        let step_list = this.stepList.toArray();
        for(let i = 0; i < step_list.length; i++) {
            if(i > this.steps.states.length) this.steps.states.push({ open: false, active: false, error: false });
            step_list[i].index = i;
            step_list[i].parent = this;
            if(this.type !== 'ordered') {
                step_list[i].ordered = false;
            }
            step_list[i].open = this.steps.states[i].open = (i===0);
            step_list[i].active = this.steps.states[i].active = (i===0);
        }
        this.stepsChange.emit(this.steps);
    }

    open(index: number) {
        let step_list = this.stepList.toArray();
        this.steps.states[index].open = true;
        for(let i = 0; i < step_list.length; i++) {
            if(this.direction === 'ordered') {
                if(i === index) {
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

    close(index: number) {
        this.steps.states[index].open = false;
        this.stepsChange.emit(this.steps);
    }
}
