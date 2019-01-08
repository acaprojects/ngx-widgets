
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseFormWidgetComponent } from '../../../../shared/base-form.component';

@Component({
    selector: 'radio-btn',
    templateUrl: './radio-button.template.html',
    styleUrls: ['./radio-button.styles.scss'],
})
export class RadioButtonComponent extends BaseFormWidgetComponent {
    @Input() public label = '';

    public select() {
        this.model = true;
        this.modelChange.emit(true);
    }
}
