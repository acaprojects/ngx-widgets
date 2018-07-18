
import { ChangeDetectorRef, Component, Input, HostListener } from '@angular/core';

@Component({
    selector: 'overlay-content',
    template: '',
    styles: [''],
})
export class OverlayContentComponent {
    @Input() public id: string = '';    // Overlay ID
    @Input() public service: any;       // Overlay Data Service
    @Input() public name: string = '';  // Overlay Name
    @Input() public model: any = {};    // Overlay data
    @Input() public fn: any = {};       // Overlay interaction functions

    public static className() { return 'OverlayContentComponent'; }
    public className() { return OverlayContentComponent.className; }

    @HostListener('window:resize') public resize() {
        this._cdr.markForCheck();
    }

    constructor(protected _cdr: ChangeDetectorRef) {
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

    public set(data: any) {
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
