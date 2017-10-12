
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';

import { DynamicBaseComponent } from '../dynamic-base.component';

import * as moment from 'moment';

@Component({
    selector: 'modal',
    templateUrl: './modal.template.html',
    styleUrls: ['./modal.styles.css'],
    animations: [
        trigger('show', [
            transition(':enter', [ style({ opacity: 0 }), animate(300, style({ opacity: 1 })) ]),
            transition(':leave', [ style({ opacity: 1 }), animate(300, style({ opacity: 0 })) ]),
        ]),
        trigger('enter', [
            transition(':enter', [
                animate(200, keyframes([
                    style({ transform: 'translateX(-200%)', offset: 0 }),
                    style({ transform: 'translateX(10%)', offset: .9 }),
                    style({ transform: 'translateX(0%)', offset: 1})
                ]))
            ]),
            transition(':leave', [
                animate(200, keyframes([
                    style({ transform: 'translateX(0%)', offset: 0 }),
                    style({ transform: 'translateX(-10%)', offset: .1 }),
                    style({ transform: 'translateX(200%)', offset: 1})
                ]))
            ]),
        ]),
    ],
})
export class ModalComponent extends DynamicBaseComponent {
    public container: any = {};
    public top: boolean;

    protected type: string = 'Modal';

    public resize() {
        setTimeout(() => {
            const el = this.model.el;
            if (el && el.nativeElement) {
                this.container = el.nativeElement.getBoundingClientRect();
            }
        }, 100);
    }

    public updateState(state: any) {
        setTimeout(() => {
            this.top = state === this.stack_id;
        });
    }

    public close(e?: any) {
        if (DynamicBaseComponent.instance_stack[this.type]) {
            const length = DynamicBaseComponent.instance_stack[this.type].length;
            if (DynamicBaseComponent.instance_stack[this.type][length - 1] === this.stack_id) {
                super.close(e);
            }
        } else {
            super.close(e);
        }
    }

    protected update(data: any) {
        this.resize();
        super.update(data);
    }
}
