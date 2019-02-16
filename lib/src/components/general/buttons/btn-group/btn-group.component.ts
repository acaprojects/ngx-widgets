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
import { BaseFormWidgetComponent } from '../../../../shared/base-form.component';

@Component({
    selector: 'btn-group',
    templateUrl: './btn-group.template.html',
    styleUrls: [ './btn-group.styles.scss'/*, '../../material-styles/material-styles.scss' */ ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonGroupComponent extends BaseFormWidgetComponent<number> {
    @Input() public items: any;

    constructor(protected _cdr: ChangeDetectorRef) {
        super();
        this.data[0] = true;
    }

    public toggle(index: number) {
        this.model = index;
        for (const s in this.data) {
            if(this.data.hasOwnProperty(s)) {
                this.data[s] = +s === +index;
            }
        }
        this.modelChange.emit(this.model);
        this._cdr.markForCheck();
    }
}
