
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';

import { DynamicBaseComponent } from '../dynamic-base.component';

import * as moment from 'moment';

@Component({
    selector: 'tooltip',
    templateUrl: './tooltip.template.html',
    styleUrls: ['./tooltip.styles.css'],
    animations: [
        trigger('show', [
            transition(':enter', [style({ opacity: 0 }), animate(300, style({ opacity: 1 }))]),
            transition(':leave', [style({ opacity: 1 }), animate(300, style({ opacity: 0 }))]),
        ]),
    ],
})
export class TooltipComponent extends DynamicBaseComponent {
    public container: any = {};
    public shown: boolean = false;

    public init(parent?: any, id?: string) {
        super.init(parent, id);
        this.renderer.listen('window', 'wheel', () => {
            if (this.shown && !this.model.hover) {
                this.close();
            }
        })
    }

    public resize() {
        this.shown = false;
        console.log(this.model);
        setTimeout(() => {
            const el = this.model.el;
            if (el && el.nativeElement) {
                this.container = el.nativeElement.getBoundingClientRect();
            }
            setTimeout(() => {
                this.shown = true;
            }, 100);
        }, 100);
    }

    protected update(data: any) {
        this.resize();
        super.update(data);
    }
}
