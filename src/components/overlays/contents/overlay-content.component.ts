
import { Component, Input, Output } from '@angular/core';

@Component({
    selector: 'overlay-content',
    template: '',
    styles: [''],
})
export class OverlayContentComponent {
    @Input() public id: string = '';    // Overlay ID
    @Input() public model: any = {};    // Overlay data
    @Input() public fn: any = {};       // Overlay interaction functions

    public set(data: any) {
        console.log(data);
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
