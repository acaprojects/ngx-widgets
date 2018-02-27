
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output, Renderer2, Injector } from '@angular/core';
import { ComponentFactoryResolver, ChangeDetectorRef, ViewChild, ViewContainerRef } from '@angular/core';

import { DynamicBaseComponent } from '../dynamic-base.component';

import * as moment_api from 'moment';
const moment = moment_api;

@Component({
    selector: 'notification',
    templateUrl: './notification.template.html',
    styleUrls: ['./notification.styles.scss'],
    animations: [
        trigger('show', [
            transition(':enter', [style({ opacity: 0, transform: 'translateX(100%)' }), animate(300, style({ opacity: 1, transform: 'translateX(100%)' }))]),
            transition(':leave', [style({ opacity: 1, transform: 'translateX(0%)' }), animate(300, style({ opacity: 0, transform: 'translateY(-100%)' }))]),
        ]),
    ],
})
export class NotificationComponent extends DynamicBaseComponent {
    public container: any = {};

    protected type = 'Notify';

    constructor(private injector: Injector) {
        super();
        this._cfr = this.injector.get(ComponentFactoryResolver);
        this._cdr = this.injector.get(ChangeDetectorRef);
        this.renderer = this.injector.get(Renderer2);
    }

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
