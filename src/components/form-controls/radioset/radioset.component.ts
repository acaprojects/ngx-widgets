
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'radioset',
    templateUrl: './radioset.template.html',
    styleUrls: ['./radioset.styles.scss'],
})
export class RadiosetComponent {
    @Input() public name: string = '';
    @Input() public list: string[] = [];
    @Input() public inline: boolean = false;
    @Input() public model: number = 0;
    @Output() public modelChange: any = new EventEmitter();

    public update(index: number) {
        this.model = index;
        this.modelChange.emit(index);
    }
}
