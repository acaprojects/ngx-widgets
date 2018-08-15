
import { Component, Injector, Renderer2 } from '@angular/core';
import { ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';

import { DynamicBaseComponent } from '../dynamic-base.component';

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
        setTimeout(() => this.resize(), 300);
    }

    public resize(show: boolean = false, tries: number = 0) {
        super.resize();
        if (!show) { this.shown = false; }
        const el = this.model.el;
        if (el && el.nativeElement) {
            const cnt = el.nativeElement.getBoundingClientRect();
            this.updatePosition();
            this.container = {
                height: cnt.height,
                width: cnt.width,
                top: cnt.top,
                left: cnt.left
            };
            console.log('Container:', cnt, window.innerWidth, window.innerHeight);
            if (((cnt.x + cnt.width) < 0 && (cnt.y + cnt.height) < 0) ||
                ((cnt.x + cnt.width) < 0  && cnt.y > window.innerHeight) ||
                (cnt.x > window.innerWidth && (cnt.y + cnt.height) < 0) ||
                (cnt.x > window.innerWidth && cnt.y > window.innerHeight)) {
                return this.event('close', 'Outside');
            }
            console.log('Parent:', this.parent);
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

    private updatePosition() {
            // Initialise model if it is falsy
        if (!this.model) { this.model = {}; }
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
            if (this.container.top < h / 8) {
                this.model.position = 'bottom';
            } else if (this.container.top + this.container.height > h - h / 8) {
                this.model.position = 'top';
            }
        } else if (this.model.position === 'left' || this.model.position === 'right') {
            // Position along X axis
            if (this.container.left < w / 8) {
                this.model.position = 'right';
            } else if (this.container.left + this.container.width > w - w / 8) {
                this.model.position = 'left';
            }
        }
            // Set to default position if still auto
        if (this.model.position === 'auto') { this.model.position = 'bottom'; }
        if (this.model.offset === 'auto') {
            const dim = {
                l: this.model.position === 'bottom' || this.model.position === 'top' ? w : h,
                p: this.model.position === 'bottom' || this.model.position === 'top' ? this.container.left : this.container.top,
                s: this.model.position === 'bottom' || this.model.position === 'top' ? this.container.width : this.container.height
            };
            if (dim.p < dim.l / 8) {
                this.model.offset = 'start';
            } else if (dim.l + dim.s > dim.l - dim.l / 8) {
                this.model.offset = 'end';
            }
        }
            // Set to default offset if still auto
        if (this.model.offset === 'auto') { this.model.offset = 'middle'; }
    }

    protected update(data: any) {
        super.update(data);
        setTimeout(() => this.updateListeners(), 200);
    }
}
