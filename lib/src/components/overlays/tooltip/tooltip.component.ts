
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output, Injector, Renderer2 } from '@angular/core';
import { ComponentFactoryResolver, ChangeDetectorRef, ViewChild, ViewContainerRef } from '@angular/core';

import { DynamicBaseComponent } from '../dynamic-base.component';

import { WIDGETS } from '../../../settings';

import * as moment_api from 'moment';
const moment = moment_api;

@Component({
    selector: 'tooltip',
    templateUrl: './tooltip.template.html',
    styleUrls: ['./tooltip.styles.scss'],
})
export class TooltipComponent extends DynamicBaseComponent {
    public container: any = {};
    public shown = false;
    public mouse_state = 'up';

    protected type = 'Tooltip';

    private listeners: any[] = [];

    constructor(private injector: Injector) {
        super();
        this._cfr = this.injector.get(ComponentFactoryResolver);
        this._cdr = this.injector.get(ChangeDetectorRef);
        this.renderer = this.injector.get(Renderer2);
    }

    public init(parent?: any, id?: string) {
        super.init(parent, id);
        this.updateListeners();
    }

    public resize(show: boolean = false, tries: number = 0) {
        super.resize();
        if (!show) { this.shown = false; }
        const el = this.model.el;
        if (el && el.nativeElement) {
            const cnt = el.nativeElement.getBoundingClientRect();
            this.container = {
                height: cnt.height,
                width: cnt.width,
                top: cnt.top,
                left: cnt.left
            };
            if ((cnt.x + cnt.width) < 0 || (cnt.y + cnt.height) < 0 || (cnt.x > window.innerWidth || cnt.y > window.innerHeight)) {
                return this.event('close', 'Outside');
            }
                // Add offset for container location
            if (this.parent.root && this.parent.root.nativeElement) {
                const box = this.parent.root.nativeElement.getBoundingClientRect();
                this.container.top -= box.top;
                this.container.left -= box.left;
            } else if (this.parent.id !== 'root') {
                return setTimeout(() => this.resize(true, tries + 1), 200);
            }
            setTimeout(() => this.shown = true, 50);
        }
        const cntr = this.container;
        if (!el || !cntr || ((cntr.height <= 0 || cntr.width <= 0) && cntr.top <= 0)) {
            setTimeout(() => this.resize(true, tries + 1), 200);
        }
    }

    private updateListeners() {
        for (const l of this.listeners) {
            if (l) { l(); }
        }
        this.listeners = [];
        if (this.model.el) {
            let el = this.model.el.nativeElement.parentElement;
            for (; !!el; el = el.parentElement) {
                this.listeners.push(this.renderer.listen(el, 'scroll', () => {
                    if (this.shown) { this.resize(true); }
                }));
            }
        }
        this.resize();
    }

    protected update(data: any) {
        super.update(data);
        setTimeout(() => this.updateListeners(), 200);
    }
}
