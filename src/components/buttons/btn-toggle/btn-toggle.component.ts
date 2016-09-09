import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'btn-toggle',
    templateUrl: './btn-toggle.template.html',
    styles: [ require('./btn-toggle.styles.scss') ]
})
export class ButtonToggle {
    @Input() active;
    @Input() inactive;
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

    clickEvent(event){
        this.value = !this.value;
        this.valueChange.emit(this.value);
    }
}
