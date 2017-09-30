
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DropdownListComponent } from './dropdown-list';

@Component({
    selector: 'dropdown',
    templateUrl: './dropdown.template.html',
    styleUrls: ['./dropdown.styles.css'],
})
export class DropdownComponent {
    @Input() public name: string = '';
    @Input() public list: any[] = [];
    @Input() public model: number = 0;
    @Input() public filter: boolean = false;
    @Input() public placeholder: string = '';
    @Input() public hideActive: boolean = false;
    @Input() public html: string = '';
    @Output() public modelChange: any = new EventEmitter();

    public id: any = {};
    public data: any = {};
    public show: boolean = false;
    public cmp: any = DropdownListComponent;

    constructor() {
        this.id = `DD${Math.floor(Math.random() * 89999999 + 10000000).toString()}`;
    }

    public ngOnChanges(changes: any) {
        this.update();
    }

    public select(e: any) {
        if (e.type === 'Select') {
            this.model = e.data.active;
            this.modelChange.emit(this.model);
            e.close();
            this.show = false;
            this.update();
        }
    }

    private update() {
        this.data = {
            list: this.list,
            active: this.model,
            filter: this.filter,
            hideActive: this.hideActive,
            placeholder: this.placeholder,
        };
    }

}
