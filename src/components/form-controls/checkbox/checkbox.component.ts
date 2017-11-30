
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'checkbox',
    templateUrl: './checkbox.template.html',
    styleUrls: ['./checkbox.styles.css'],
})
export class CheckboxComponent {
    @Input() name: string = '';
    @Input() model: boolean = false;
    @Input() label: string = '';
    @Output() modelChange: any = new EventEmitter();

    public toggle() {
        this.model = !this.model;
        this.modelChange.emit(this.model);
    }
}
