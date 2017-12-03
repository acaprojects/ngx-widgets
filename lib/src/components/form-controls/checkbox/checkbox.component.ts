
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'checkbox',
    templateUrl: './checkbox.template.html',
    styleUrls: ['./checkbox.styles.scss'],
})
export class CheckboxComponent {
    @Input() name = '';
    @Input() model = false;
    @Input() label = '';
    @Output() modelChange: any = new EventEmitter();

    public toggle() {
        this.model = !this.model;
        this.modelChange.emit(this.model);
    }
}
