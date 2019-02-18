
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseFormWidgetComponent } from '../../../shared/base-form.component';

@Component({
    selector: 'checkbox',
    templateUrl: './checkbox.template.html',
    styleUrls: ['./checkbox.styles.scss'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CheckboxComponent),
        multi: true
      }
    ]
})
export class CheckboxComponent extends BaseFormWidgetComponent<boolean> implements ControlValueAccessor {
    @Input() public label = '';
    @Input() public side = 'right';

    public toggle() {
        this.model = !this.model;
        this.modelChange.emit(this.model);
        this.change(this.model);
    }
}
