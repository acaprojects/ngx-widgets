/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   15/09/2016 12:37 PM
 * @Email:  alex@yuion.net
 * @Filename: toggle.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 30/01/2017 10:06 AM
 */

import { Component, EventEmitter, Input, Output} from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

export interface IToggleOptions {
    on_text?: string;
    off_text?: string;
};

@Component({
    selector: 'toggle',
    templateUrl: './toggle.template.html',
    styleUrls: [ './toggle.styles.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent {
    @Input() public name = '';
    @Input() public model = true;
    @Input() public type = '';
    @Input() public options: IToggleOptions = {};
    @Input() public disabled = false;
    @Output() public modelChange = new EventEmitter();

    public toggle() {
        if (!this.disabled) {
            this.model = !this.model;
            this.modelChange.emit(this.model);
        }
    }
}
