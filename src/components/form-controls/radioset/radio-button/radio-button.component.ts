
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'radio-btn',
    templateUrl: './radio-button.template.html',
    styleUrls: ['./radio-button.styles.scss'],
})
export class RadioButtonComponent {
    @Input() public name: string = '';
    @Input() public label: string = '';
    @Input() public model: boolean = false;
    @Output() public modelChange: any = new EventEmitter();

    public select() {
        this.model = true;
        this.modelChange.emit(true);
    }
}
