import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ButtonToggle } from '../btn-toggle';

@Component({
    selector: 'btn-group',
    directives: [ ButtonToggle ],
    templateUrl: './btn-group.html',
    styles: [
        require('./btn-group.scss')
    ]
})
export class ButtonGroup {
    @Input() items;
    @Input() selected: number = 0;
    @Input() cssClass: string = 'default';
    @Output() selectedChange = new EventEmitter();

    constructor(){

    }

    ngOnChanges(changes: any){
        this.selectedChange.emit(this.selected);
    }

    clickEvent(event){
        this.selected = event;
        this.selectedChange.emit(this.selected);
    }
}
