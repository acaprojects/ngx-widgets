/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: input-field.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 27/01/2017 5:30 PM
 */

import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseFormWidgetComponent } from '../../../shared/base-form.component';

@Component({
    selector: 'input-field',
    styleUrls: [ './input-field.styles.scss'],
    templateUrl: './input-field.template.html',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputFieldComponent),
        multi: true
      }
    ]
})
export class InputFieldComponent extends BaseFormWidgetComponent<string> implements ControlValueAccessor {
    @Input() public type = 'text';
    @Input() public mask = '';
    @Input() public placeholder = '';
    @Input() public limit = 65535;
    @Output() public focus = new EventEmitter();
    @Output() public blur = new EventEmitter();

    public state: any = {};

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
