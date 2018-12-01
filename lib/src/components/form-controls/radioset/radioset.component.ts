
import { Component, Input } from '@angular/core';

import { BaseFormWidgetComponent } from '../../../shared/base-form.component';

@Component({
    selector: 'radioset',
    templateUrl: './radioset.template.html',
    styleUrls: ['./radioset.styles.scss'],
})
export class RadiosetComponent extends BaseFormWidgetComponent {
    @Input() public list: string[] = [];
    @Input() public inline = false;

    public update(index: number) {
        this.model = index;
        this.modelChange.emit(index);
    }
}
