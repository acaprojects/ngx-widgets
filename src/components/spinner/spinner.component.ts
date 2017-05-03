/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: spinner.component.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:32 AM
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'spinner',
    styleUrls: [ './spinner.style.css' ],
    templateUrl: './spinner.template.html'
})
export class Spinner {
    @Input() type: string = 'plane';
    @Input() color: string = '#FFF';
    @Input() cssClass: string = 'default';

    id : string = '';
    state: string = 'one';

    constructor() {
    }

    ngOnInit() {

    }

    ngOnChanges(changes: any) {
        if(this.type === null || this.type === undefined) this.type = 'plane';
    }

}
