
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';

import { DynamicBaseComponent } from '../dynamic-base.component';

import { WIDGETS } from '../../../settings';

import * as moment from 'moment';

@Component({
    selector: 'tooltip',
    templateUrl: './tooltip.template.html',
    styleUrls: ['./tooltip.styles.css'],
})
export class TooltipComponent extends DynamicBaseComponent {
    public container: any = {};
    public shown: boolean = false;
    public mouse_state: string = 'up';

    protected type: string = 'Tooltip';

    public init(parent?: any, id?: string) {
        super.init(parent, id);
        this.renderer.listen('window', 'wheel', () => {
            if (this.shown && !this.model.hover) {
                this.resize(true);
            }
        });
    }

    public resize(show: boolean = false, tries: number = 0) {
        if (tries > 5) { return; }
        super.resize();
        if (!show) { this.shown = false; }
        setTimeout(() => {
            const el = this.model.el;
            if (el && el.nativeElement) {
                this.container = el.nativeElement.getBoundingClientRect();
                setTimeout(() => {
                    this.shown = true;
                }, 50);
            }
            if (!el || !this.container || ((this.container.height <= 0 || this.container.width <= 0) && this.container.top <= 0)) {
                setTimeout(() => {
                    this.resize(show, tries+1);
                }, 200);
            }
        }, 100);
    }

    public mouseDown(e?: any) {
        this.mouse_state = 'down';
        if (e && this.box && !this.model.tapped) {
            if (e.touches) {
                e = e.touches[0];
            }
            const c = { x: e.clientX, y: e.clientY };
            if (c.x >= this.box.left && c.y >= this.box.top && c.x <= this.box.left + this.box.width && c.y <= this.box.top + this.box.height) {
                WIDGETS.log('T_TIP', `['${this.id}'] Mouse down event inside tooltip`);
                this.model.tapped = true;
            }
        }
    }

    public mouseUp(e?: any) {
        this.mouse_state = 'up';
        if (!this.model.tapped) {
            WIDGETS.log('T_TIP', `['${this.id}'] Mouse up event`);
            this.event('Close', 'Click');
        }
        setTimeout(() => {
            this.model.tapped = false;
        }, 100);
    }

    public mouseMove(e?: any) {
        if (this.mouse_state === 'down' && !this.model.tapped) {
            WIDGETS.log('T_TIP', `['${this.id}'] Mouse move event after mouse down outside`);
            this.event('Close', 'MouseMove');
        }
    }

    protected update(data: any) {
        this.resize();
        super.update(data);
    }
}
