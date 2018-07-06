/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   15/09/2016 12:32 PM
 * @Email:  alex@yuion.net
 * @Filename: btn.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 07/02/2017 11:51 AM
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'btn',
    styleUrls: ['./btn.styles.scss'/* , '../../material-styles/material-styles.scss' */],
    templateUrl: './btn.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
    // Component Inputs
    @Input() public name = '';
    @Input() public model = false;
    @Input() public type = 'button';
    @Input() public format = 'raised';
    @Input() public disabled = false;
    @Input() public toggle = false;
    // Output emitters
    @Output() public modelChange = new EventEmitter();
    @Output() public tapped = new EventEmitter();

    private timers: any = {};

    public tap(e: any) {
        if (this.timers.tap) {
            clearTimeout(this.timers.tap);
            this.timers.tap = null;
        }
        this.timers.tap = setTimeout(() => {
            if (this.toggle) {
                this.model = !this.model;
                this.modelChange.emit(this.model);
            }
            this.tapped.emit(e);
            this.timers.tap = null;
        }, 300);
    }
}
