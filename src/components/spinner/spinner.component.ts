/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: spinner.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:32 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'spinner',
    styleUrls: [ './spinner.style.css' ],
    templateUrl: './spinner.template.html',
})
export class Spinner {
    @Input() public type: string = 'plane';
    @Input() public color: string = '#FFF';
    @Input() public cssClass: string = 'default';

    public ngOnChanges(changes: any) {
        if (this.type === null || this.type === undefined) {
            this.type = 'plane';
        }
    }

}
