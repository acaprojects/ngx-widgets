
import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Injector, Renderer2 } from '@angular/core';
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
export class ContextItemComponent extends DynamicBaseComponent {
    public container: any = {};

    protected type = 'ContextItem';

    constructor(private injector: Injector) {
        super();
        this._cfr = this.injector.get(ComponentFactoryResolver);
        this._cdr = this.injector.get(ChangeDetectorRef);
        this.renderer = this.injector.get(Renderer2);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.model.first = false;
        setTimeout(() => {
            this.subs.push(
                this.renderer.listen('window', 'mouseup', () => { 
                    setTimeout(() => this.remove(), 300);
                    console.log('Close: mouse');
                })
            );
            this.subs.push(
                this.renderer.listen('window', 'touchend', () => { 
                    if (!this.model.first) {
                        return this.model.first = true;
                    }
                    setTimeout(() => this.remove(), 300);
                    console.log('Close: touch'); 
                })
            );
        }, 300);
    }

    public update(data) {
        super.update(data);
    }

    public updateComponentData(cmp) {
        if (cmp && cmp.data) {
            cmp.model = this.model.data;
        }
    }

    public resize() {
        this.close({ type: 'Resize' });
    }
}
