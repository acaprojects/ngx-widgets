
import { Component, Input, forwardRef } from '@angular/core';

import { BaseFormWidgetComponent } from '../../../shared/base-form.component';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'radioset',
    templateUrl: './radioset.template.html',
    styleUrls: ['./radioset.styles.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RadiosetComponent),
        multi: true
    }]
})
export class RadiosetComponent extends BaseFormWidgetComponent implements ControlValueAccessor {
    @Input() public list: string[] = [];
    @Input() public inline = false;

    public update(index: number) {
        this.model = index;
        this.modelChange.emit(index);
    }
}
