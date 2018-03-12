
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
            transition(':enter', [style({ opacity: 0, transform: 'translateY(-100%)' }), animate(300, style({ opacity: 1, transform: 'translateY(0%)' }))]),
            transition(':leave', [style({ opacity: 1, transform: 'translateY(0%)' }), animate(300, style({ opacity: 0, transform: 'translateY(100%)' }))]),
        ]),
    ],
})
export class NotificationComponent extends DynamicBaseComponent {
    public container: any = {};
    protected static self: NotificationComponent;
    public static notify(id: string, data: any, cntr: string = 'root') {
        if (NotificationComponent.self) {
            setTimeout(() => NotificationComponent.self.notify(id, data), 10);
        }
        return () => { NotificationComponent.dismiss(id, cntr); };
    }

    public static dismiss(id: string, cntr: string = 'root') {
        if (NotificationComponent.self) {
            setTimeout(() => NotificationComponent.self.dismiss(id), 10);
        }
    }

    protected type = 'Notify';

    constructor(private injector: Injector) {
        super();
        this._cfr = this.injector.get(ComponentFactoryResolver);
        this._cdr = this.injector.get(ChangeDetectorRef);
        this.renderer = this.injector.get(Renderer2);
        NotificationComponent.self = this;
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

    public notify(id: string, data: any) {
        if (!this.model.items) {
            this.model.items = [];
        }
        this.model.items.push({
            id,
            time: moment().valueOf(),
            data
        });
        if (this.model.timeout && this.model.timeout > 0) {
            setTimeout(() => this.dismiss(id), this.model.timeout);
        }
    }

    public dismiss(id: string) {
        for (const item of this.model.items) {
            if (item.id === id) {
                this.model.items.splice(this.model.items.indexOf(item), 1);
                break;
            }
        }
    }
}
