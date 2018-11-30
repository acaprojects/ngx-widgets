
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseWidgetComponent } from './base.component';

@Component({
    selector: 'a-base-form-widget-cmp',
    template: '',
    styles: ['']
})
export class BaseFormWidgetComponent extends BaseWidgetComponent {
    @Input() public model: any;
    @Output() public modelChange = new EventEmitter();

    public data: any = {};
}