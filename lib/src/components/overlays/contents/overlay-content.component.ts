
import { Component, Input, Output } from '@angular/core';

@Component({
    selector: 'overlay-content',
    template: '',
    styles: [''],
})
export class OverlayContentComponent {
    @Input() public id = '';    // Overlay ID
    @Input() public name = '';    // Overlay ID
    @Input() public model: any = {};    // Overlay data
    @Input() public fn: any = {};       // Overlay interaction functions

    public static className() { return 'OverlayContentComponent'; }
    public className() { OverlayContentComponent.className; }

    constructor() {
        this.id = `overlay-${Math.floor(Math.random() * 8999999 + 1000000)}`;
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
    }
}
