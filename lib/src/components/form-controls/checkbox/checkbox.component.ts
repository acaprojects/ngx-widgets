
import { Component, Input } from '@angular/core';

import { BaseFormWidgetComponent } from '../../../shared/base-form.component';

@Component({
    selector: 'checkbox',
    templateUrl: './checkbox.template.html',
    styleUrls: ['./checkbox.styles.scss'],
})
export class CheckboxComponent extends BaseFormWidgetComponent {
    @Input() public label = '';
    @Input() public side = 'right';

    public toggle() {
        this.model = !this.model;
        this.modelChange.emit(this.model);
    }
}
