
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'radio-btn',
    templateUrl: './radio-button.template.html',
    styleUrls: ['./radio-button.styles.scss'],
})
export class RadioButtonComponent {
    @Input() public name = '';
    @Input() public label = '';
    @Input() public model = false;
    @Output() public modelChange: any = new EventEmitter();

    public select() {
        this.model = true;
        this.modelChange.emit(true);
    }
}
