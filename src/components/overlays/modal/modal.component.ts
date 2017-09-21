
import { animate, state, style, transition, trigger } from '@angular/animations';
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
            transition(':enter', [
                style({
                    top: '50%', left: '50%', right: '50%', bottom: '50%', opacity: 0, transform: 'scale(0)'
                }), animate(300,
                    style({
                        top: '0', left: '0', right: '0', bottom: '0', opacity: 1, transform: 'scale(1)'
                    }))
                ]
            ),
            transition(':leave', [
                style({
                    top: '0', left: '0', right: '0', bottom: '0', opacity: 1, transform: 'scale(1)'
                }), animate(300, style({
                    top: '50%', left: '50%', right: '50%', bottom: '50%', opacity: 0, transform: 'scale(0)'}))
                ]
            ),
        ]),
    ],
})
export class ModalComponent extends DynamicBaseComponent {
    public container: any = {};

    public resize() {
        setTimeout(() => {
            const el = this.model.el;
            if (el && el.nativeElement) {
                this.container = el.nativeElement.getBoundingClientRect();
            }
        }, 100);
    }

    protected update(data: any) {
        this.resize();
        super.update(data);
    }
}
