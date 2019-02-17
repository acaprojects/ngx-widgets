
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, Injector, Renderer2 } from '@angular/core';
import { ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';

import { DynamicBaseComponent } from '../dynamic-base.component';

@Component({
    selector: 'tooltip-overlay',
    templateUrl: './tooltip.template.html',
    styleUrls: ['./tooltip.styles.scss'],
    animations: [
        trigger('show', [
            transition('void => top', [style({ opacity: 0, top: '16px' }), animate(100, style({ opacity: 1, top: '*' }))]),
            transition('void => left', [style({ opacity: 0, left: '16px' }), animate(100, style({ opacity: 1, left: '*' }))]),
            transition('void => right', [style({ opacity: 0, right: '16px' }), animate(100, style({ opacity: 1, right: '*' }))]),
            transition('void => bottom', [style({ opacity: 0, bottom: '16px' }), animate(100, style({ opacity: 1, bottom: '*' }))]),
        ]),
    ],
})
export class TooltipComponent extends DynamicBaseComponent {
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

    public init(parent?: any, id?: string): void {
        super.init(parent, id);
        this.updateListeners();
        setTimeout(() => this.resize(), 300);
    }

    public resize(show: boolean = false, tries: number = 0): void {
        super.resize();
        if (!show) { this.shown = false; }
        const el = this.model.el;
        if (el && el.nativeElement) {
            const cnt = el.nativeElement.getBoundingClientRect();
            this.updatePosition();
            this.cntr_box = {
                height: cnt.height,
                width: cnt.width,
                top: cnt.top,
                left: cnt.left
            } as ClientRect;
            if (((cnt.x + cnt.width) < 0 && (cnt.y + cnt.height) < 0) ||
                ((cnt.x + cnt.width) < 0 && cnt.y > window.innerHeight) ||
                (cnt.x > window.innerWidth && (cnt.y + cnt.height) < 0) ||
                (cnt.x > window.innerWidth && cnt.y > window.innerHeight)) {
                return this.event('close', 'Outside');
            }
            // Add offset for container location
            if (this.parent.root && this.parent.root.nativeElement) {
                const box = this.parent.root.nativeElement.getBoundingClientRect();
                this.cntr_box.top -= box.top;
                this.cntr_box.left -= box.left;
            } else if (this.parent.id !== 'root') {
                return <any>setTimeout(() => this.resize(true, tries + 1), 200);
            }
            setTimeout(() => this.shown = true, 50);
        }
        const cntr = this.cntr_box;
        if (!el || !cntr || ((cntr.height <= 0 || cntr.width <= 0) && cntr.top <= 0)) {
            setTimeout(() => this.resize(true, tries + 1), 200);
        }
    }

    private updateListeners(): void {
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

    private updatePosition() {
        this.timeout('position', () => {
            // Initialise model if it is falsy
            if (!this.model) { this.model = {}; }
            if (!this.cntr_box) {
                return this.resize();
            }
            if (!this.model.preferences) {
                this.model.preferences = {
                    position: this.model.position || 'bottom',
                    offset: this.model.offset || 'middle'
                };
            }
            // Initialise tooltip positioning
            this.model.position = (this.model.preferences ? this.model.preferences.position : this.model.position) || this.model.position;
            this.model.offset = (this.model.preferences ? this.model.preferences.offset : this.model.offset) || this.model.offset;
            // Compare parent to window to determine tooltip position
            const w = window.innerWidth;
            const h = window.innerHeight;
            if (this.model.position === 'bottom' || this.model.position === 'top' || this.model.position === 'auto') {
                // Position along Y axis
                if (this.cntr_box.top < h / 8) {
                    this.model.position = 'bottom';
                } else if (this.cntr_box.top + this.cntr_box.height > h - h / 8) {
                    this.model.position = 'top';
                }
            } else if (this.model.position === 'left' || this.model.position === 'right') {
                // Position along X axis
                if (this.cntr_box.left < w / 8) {
                    this.model.position = 'right';
                } else if (this.cntr_box.left + this.cntr_box.width > w - w / 8) {
                    this.model.position = 'left';
                }
            }
            // Set to default position if still auto
            if (this.model.position === 'auto') { this.model.position = 'bottom'; }
            if (this.model.offset === 'auto') {
                const dim = {
                    l: this.model.position === 'bottom' || this.model.position === 'top' ? w : h,
                    p: this.model.position === 'bottom' || this.model.position === 'top' ? this.cntr_box.left : this.cntr_box.top,
                    s: this.model.position === 'bottom' || this.model.position === 'top' ? this.cntr_box.width : this.cntr_box.height
                };
                if (dim.p < dim.l / 8) {
                    this.model.offset = 'start';
                } else if (dim.l + dim.s > dim.l - dim.l / 8) {
                    this.model.offset = 'end';
                }
            }
            // Set to default offset if still auto
            if (this.model.offset === 'auto') { this.model.offset = 'middle'; }
        }, 20)
    }

    protected update(data: any): void {
        super.update(data);
        setTimeout(() => this.updateListeners(), 200);
    }
}
