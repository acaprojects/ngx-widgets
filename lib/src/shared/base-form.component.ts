
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseWidgetComponent } from './base.component';
import { ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'a-base-form-widget-cmp',
    template: '',
    styles: ['']
})
export class BaseFormWidgetComponent extends BaseWidgetComponent implements ControlValueAccessor {
    @Input() public model: any;
    @Input() public disabled = false;
    @Output() public modelChange = new EventEmitter();

    public onChange: Function;
    public onTouch: Function;
    public data: any = {};


    public writeValue(value: any) {
        this.model = value;
    }

    /**
     * Register on change callback given for form control
     * @param fn
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Register on touched callback given for form control
     * @param fn
     */
    public registerOnTouched(fn: any): void {
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