/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   15/09/2016 12:32 PM
 * @Email:  alex@yuion.net
 * @Filename: btn.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 07/02/2017 11:51 AM
 */

import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

import { BaseFormWidgetComponent } from '../../../../shared/base-form.component';

@Component({
    selector: 'btn',
    styleUrls: ['./btn.styles.scss'/* , '../../material-styles/material-styles.scss' */],
    templateUrl: './btn.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent extends BaseFormWidgetComponent<boolean> {
    // Component Inputs
    @Input() public type = 'button';
    @Input() public format = 'raised';
    @Input() public toggle = false;
    // Output emitters
    @Output() public tapped = new EventEmitter();

    constructor(protected _cdr: ChangeDetectorRef) {
        super();
    }

    public tap(e: any) {
        this.timeout('tap', () => {
            if (this.toggle) {
                this.model = !this.model;
                this.modelChange.emit(this.model);
            }
            this.tapped.emit(e);
        }, 300);
    }
}
