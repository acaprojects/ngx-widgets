/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: btn-group.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:28 AM
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'btn-group',
    templateUrl: './btn-group.template.html',
    styleUrls: [ './btn-group.styles.scss'/*, '../../material-styles/material-styles.scss' */ ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonGroupComponent {
    @Input() public items: any;
    @Input() public model = 0;
    @Input() public name = '';
    @Output() public modelChange = new EventEmitter();

    public state: any = {};

    constructor(private _cdr: ChangeDetectorRef) {
        this.state[0] = true;
    }

    public toggle(index: number) {
        this.model = index;
        for (const s in this.state) {
            if(this.state.hasOwnProperty(s)) {
                this.state[s] = +s === +index;
            }
        }
        this.modelChange.emit(this.model);
        this._cdr.markForCheck();
    }
}
