
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
                this.renderer.listen('window', 'mouseup', () => { 
                    this.show = false;
                    setTimeout(() => this.remove(), 300);
                })
            );
            this.subs.push(
                this.renderer.listen('window', 'touchend', () => { 
                    if (!this.model.first) {
                        return this.model.first = true;
                    }
                    this.show = false;
                    setTimeout(() => this.remove(), 300);
                })
            );
        }, 300);
    }

    public resize() {
        this.close({ type: 'Resize' });
    }
}
