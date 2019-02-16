
import { ChangeDetectorRef, Component, Input, HostListener } from '@angular/core';

import { BaseWidgetComponent } from '../../shared/base.component';

@Component({
    selector: 'overlay-content',
    template: '',
    styles: [''],
})
export class OverlayContentComponent<T> extends BaseWidgetComponent {
    @Input() public service: T;       // Overlay Data Service
    @Input() public model: { [name: string]: any } = {};    // Overlay data
    @Input() public fn: { [name: string]: Function } = {};       // Overlay interaction functions

    public static className() { return 'OverlayContentComponent'; }
    public className() { return OverlayContentComponent.className; }

    @HostListener('window:resize') public resize() {
        this._cdr.markForCheck();
    }

    constructor(protected _cdr: ChangeDetectorRef) {
        super();
        this.id = `overlay-${Math.floor(Math.random() * 8999999 + 1000000)}`;
    }

    /**
     * Executes the close function for the parent modal container
     */
    public close() {
        if (this.fn.close instanceof Function) {
            this.fn.close();
        }
    }

    /**
     *
     * @param type
     */
    public event(type: string) {
        if (this.fn.event instanceof Function) {
            this.fn.event(type);
        }
    }

    public set(data: { [name: string]: any }) {
        if (!this.model) {
            this.model = data;
        } else {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    this.model[key] = data[key];
                }
            }
        }
        this._cdr.markForCheck();
    }
}
