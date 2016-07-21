import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'btn-toggle',
    templateUrl: './btn-toggle.html',
    styles: [
        require('./btn-toggle.scss')
    ]
})
export class ButtonToggle {
    @Input() active;
    @Input() inactive;
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
