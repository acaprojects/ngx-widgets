
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Renderer2, Injector } from '@angular/core';
import { ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';

import { DynamicBaseComponent } from '../dynamic-base.component';

import * as moment_api from 'moment';
const moment = moment_api;

@Component({
    selector: 'notification-overlay',
    templateUrl: './notification.template.html',
    styleUrls: ['./notification.styles.scss'],
    animations: [
        trigger('show', [
            transition(':enter', [
                animate(220, keyframes([
                    style({ opacity: 0, transform: 'translateX(100%)', offset: 0 }),
                    style({ opacity: .9, transform: 'translateX(-10%)', offset: .9 }),
                    style({ opacity: 1, transform: 'translateX(0%)', offset: 1 })
                ]))
            ]),
            transition(':leave', [
                animate(300, keyframes([
                    style({ opacity: 1, transform: 'translateY(0%)', offset: 0 }),
                    style({ opacity: .8, transform: 'translateY(20%)', offset: .2 }),
                    style({ opacity: 0, transform: 'translateY(-100%)', offset: 1 })
                ]))
            ]),
        ]),
    ],
})
export class NotificationComponent extends DynamicBaseComponent {
    public container: any = {};
    protected static self: NotificationComponent = null;
    /**
     * Adds a new notification to the global component instance
     * @param id ID of notification
     * @param data Data to pass to the notification
     * @param action Action display to show on notification
     * @param cntr Container with which the notification should be displayed
     */
    public static notify(id: string, data: any, action?: () => void, cntr: string = 'root') {
        if (NotificationComponent.self) {
            setTimeout(() => NotificationComponent.self.notify(id, data, action), 10);
        }
        return () => { NotificationComponent.dismiss(id, cntr); };
    }
    /**
     * Remove a notification
     * @param id ID of the notification
     * @param cntr Container of the notification layer
     */
    public static dismiss(id: string, cntr: string = 'root') {
        if (NotificationComponent.self) {
            setTimeout(() => NotificationComponent.self.dismiss(id), 10);
        }
    }

    /**
     * Set delay for automatically removing notifications
     * @param delay Number of milliseconds
     */
    public static timeout(delay: number) {
        if (NotificationComponent.self) {
            NotificationComponent.self.timeout(delay);
        }
    }

    protected type = 'Notify';

    constructor(private injector: Injector) {
        super();
        this._cfr = this.injector.get(ComponentFactoryResolver);
        this._cdr = this.injector.get(ChangeDetectorRef);
        this.renderer = this.injector.get(Renderer2);
        NotificationComponent.self = this;
        this.model.timeout = 30 * 1000;
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

    public timeout(delay: number) {
        this.model.timeout = delay;
    }

    public notify(id: string, data: any, action?: () => void) {
        if (!this.model.items) {
            this.model.items = [];
        }
        this.model.items.unshift({
            id,
            time: moment().valueOf(),
            data: data,
            name: data.name,
            action
        });
        if (data.timeout || this.model.timeout) {
            setTimeout(() => this.dismiss(id), data.timeout || this.model.timeout);
        }
    }

    public dismiss(id: string) {
        if (this.model.items) {
            for (const item of this.model.items) {
                if (item.id === id) {
                    item.hide = true;
                    setTimeout(() => {
                        this.model.items.splice(this.model.items.indexOf(item), 1);
                        if (item.data && item.data.dismiss && item.data.dismiss instanceof Function) {
                            item.data.dismiss();
                        }
                    }, 300);
                    break;
                }
            }
        }
    }

    public action(item: any) {
        if (item.action && item.action instanceof Function) {
            item.action();
            this.dismiss(item.id);
        }
    }

    public removeItem(item: any) {
        if (!item.action) {
            this.dismiss(item.id);
        }
    }

    protected render() { return; }
}
