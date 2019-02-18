
import { Component, Injector, ComponentFactoryResolver, ChangeDetectorRef, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { DynamicBaseComponent } from '../dynamic-base.component';

import { DragNDropService } from '../../../services/dragndrop.service';

@Component({
    selector: 'dragged-item-overlay',
    templateUrl: './dragged-item.template.html',
    styleUrls: ['./dragged-item.style.scss']
})
export class DraggedItemOverlayComponent extends DynamicBaseComponent {
    public model: { [name: string]: any } = {};

    @ViewChild('item') private item: ElementRef;

    constructor(private drop_service: DragNDropService, private injector: Injector) {
        super();
        this._cfr = this.injector.get(ComponentFactoryResolver);
        this._cdr = this.injector.get(ChangeDetectorRef);
        this.renderer = this.injector.get(Renderer2);
        this.drop_service.listen((item) => {
            this.renderItem(item);
        });
        this.model.position = { x: 0, y: 0 };
    }

    public ngOnDestroy() {
            // Clear event listener
        if (this.model.listener) {
            this.model.listener.mouse();
            this.model.listener.touch();
            this.model.listener = null;
        }
    }

    public reposition(event: any) {
        this.timeout('reposition', () => {
            this.model.position = event.center ? event.center : { x: event.clientX || event.touches[0].clientX, y: event.clientY || event.touches[0].clientY };
            this.drop_service.update(event);
        }, 10);
    }

    private renderItem(item: any) {
        if (!this.item || !this.item.nativeElement) {
            return setTimeout(() => this.renderItem(item), 300);
        }
        if (item && item.el) {
                // Remove any old elements
            if (this.model.el) {
                this.renderer.removeChild(this.item.nativeElement, this.model.el);
            }
                // Clear any old event listeners
            if (this.model.listener) {
                this.model.listener.mouse();
                this.model.listener.touch();
                this.model.listener = null;
            }
                // Add element
            this.model.el = item.el;
            this.renderer.appendChild(this.item.nativeElement, this.model.el);
            this.model.offset = item && item.options ? item.options.offset || { x: 0, y: 0 } : { x: 0, y: 0 };
            this.model.size = item.options ? item.options.size : null;
            if (item && item.options) {
                this.reposition({ center: item.options.start });
            }
            this.model.listener = {
                mouse: this.renderer.listen('window', 'mousemove', (e) => this.reposition(e)),
                touch: this.renderer.listen('window', 'touchmove', (e) => this.reposition(e))
            };
        } else if (this.model.el) {
                // Remove element
            this.renderer.removeChild(this.item.nativeElement, this.model.el);
            this.model.el = null;
                // Clear event listeners
            if (this.model.listener) {
                this.model.listener.mouse();
                this.model.listener.touch();
                this.model.listener = null;
            }
        }
    }

}
