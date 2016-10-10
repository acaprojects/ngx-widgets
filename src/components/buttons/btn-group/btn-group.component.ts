import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'btn-group',
    templateUrl: './btn-group.template.html',
    styleUrls: [ './btn-group.styles.css' ]
})
export class ButtonGroup {
    @Input() items: any;
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

    clickEvent(event: any){
        this.selected = event;
        this.selectedChange.emit(this.selected);
    }
}
