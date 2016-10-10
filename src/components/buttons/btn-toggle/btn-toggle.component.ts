import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'btn-toggle',
    templateUrl: './btn-toggle.template.html',
    styleUrls: [ './btn-toggle.styles.css' ]
})
export class ButtonToggle {
    @Input() active: string;
    @Input() inactive: string;
    @Input() cssClass: string = '';
    @Input() value: boolean = false;
    @Output() valueChange = new EventEmitter();
    available: boolean = false;

    constructor(){

    }

    ngAfterContentInit(){
        this.available = true;
    }

    ngOnChanges(changes: any){

    }

    clickEvent(event: Event){
        this.value = !this.value;
        this.valueChange.emit(this.value);
    }
}
