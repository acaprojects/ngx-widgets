/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: btn-group.component.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:28 AM
*/

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
