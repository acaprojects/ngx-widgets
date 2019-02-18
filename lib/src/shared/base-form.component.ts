
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseWidgetComponent } from './base.component';
import { ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'a-base-form-widget-cmp',
    template: '',
    styles: ['']
})
export class BaseFormWidgetComponent<T> extends BaseWidgetComponent implements ControlValueAccessor {
    @Input() public model: T;
    @Input() public disabled = false;
    @Output() public modelChange = new EventEmitter<T>();

    public onChange: (_: T) => void;
    public onTouch: (_: T) => void;
    public data: { [name: string]: any } = {};


    public writeValue(value: T) {
        this.model = value;
    }

    /**
     * Register on change callback given for form control
     * @param fn
     */
    public registerOnChange(fn: (_: T) => void): void {
        this.onChange = fn;
    }

    /**
     * Register on touched callback given for form control
     * @param fn
     */
    public registerOnTouched(fn: (_: T) => void): void {
      this.onTouch = fn;
    }

    /**
     * Update angular form control value
     * @param e
     */
    public change(e?: any) {
        if (this.onChange) { this.onChange(this.model); }
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled
    }
}