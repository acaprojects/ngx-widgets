/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: btn-toggle.component.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:28 AM
*/

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
