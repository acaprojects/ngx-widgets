/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: input-field.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 27/01/2017 5:30 PM
 */

import { Component, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild } from '@angular/core';

@Component({
    selector: 'input-field',
    styleUrls: [ './input-field.styles.scss'],
    templateUrl: './input-field.template.html'
})
export class InputFieldComponent {
    @Input() public name = '';
    @Input() public model: string;
    @Input() public type = 'text';
    @Input() public disabled = false;
    @Input() public mask = '';
    @Input() public placeholder = '';
    @Input() public limit = 65535;
    @Output() public modelChange = new EventEmitter();
    @Output() public focus = new EventEmitter();
    @Output() public blur = new EventEmitter();

    public state: any = {};

    @ViewChild('input') private field: ElementRef;


    public focusElement() {
        if (this.field) {
            setTimeout(() => this.field.nativeElement.focus(), 300);
        }
    }

    public focused(e?: any) {
        this.state.focus = true;
        this.focus.emit(e);
    }

    public blurred(e?: any) {
        this.state.focus = false;
        this.blur.emit(e);
    }

    public valueChanged(value: string) {
        this.modelChange.emit(value);
    }

}
