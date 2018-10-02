
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Injector, Renderer2, ViewChild, ComponentRef, OnInit, AfterViewInit } from '@angular/core';
import { ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';

import { DynamicBaseComponent } from '../dynamic-base.component';

@Component({
    selector: 'context-item-overlay',
    templateUrl: './context-item.template.html',
    styleUrls: ['./context-item.styles.scss'],
    animations: [
        trigger('show', [
            transition(':leave', [style({ opacity: 1 }), animate(300, style({ opacity: 0 }))]),
        ]),
    ]
})
export class ContextItemComponent extends DynamicBaseComponent implements OnInit, AfterViewInit {
    public container: any = {};
    public show: boolean = true;

    protected type = 'ContextItem';

    constructor(private injector: Injector) {
        super();
        this._cfr = this.injector.get(ComponentFactoryResolver);
        this._cdr = this.injector.get(ChangeDetectorRef);
        this.renderer = this.injector.get(Renderer2);
    }

    public ngOnInit() {
        this.show = true;
        super.ngOnInit();
        this.model.first = false;
        setTimeout(() => {
            this.subs.push(
                this.renderer.listen('window', 'mouseup', () => this.handleClose())
            );
            this.subs.push(
                this.renderer.listen('window', 'touchend', () => this.handleClose())
            );
        }, 300);
    }

    public handleClose() {
        if (!this.timers.close) {
            clearTimeout(this.timers.close);
        }
        this.timers.close = setTimeout(() => {
            this.show = false;
            this.timers.close = null;
            setTimeout(() => this.remove(), 250);
        }, 50)
    }

    public resize() {
        this.close({ type: 'Resize' });
    }
}
