import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'btn-group',
    templateUrl: './btn-group.template.html',
    styles: [ require('./btn-group.styles.scss') ]
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

    ngAfterViewChecked() {

    }

    clickEvent(event){
        this.selected = event;
        this.selectedChange.emit(this.selected);
    }
}
