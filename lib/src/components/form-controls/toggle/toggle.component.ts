/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   15/09/2016 12:37 PM
 * @Email:  alex@yuion.net
 * @Filename: toggle.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 30/01/2017 10:06 AM
 */

import { Component, Input, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { BaseFormWidgetComponent } from '../../../shared/base-form.component';

export interface IToggleOptions {
    on_text?: string;
    off_text?: string;
};

@Component({
    selector: 'toggle',
    templateUrl: './toggle.template.html',
    styleUrls: [ './toggle.styles.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ToggleComponent),
        multi: true
    }]
})
export class ToggleComponent extends BaseFormWidgetComponent implements ControlValueAccessor {
    @Input() public type = '';
    @Input() public options: IToggleOptions = {};

    public toggle() {
        if (!this.disabled) {
            this.model = !this.model;
            this.modelChange.emit(this.model);
            this.change(this.model);
        }
    }
}
