import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicField } from '../dynamic-field.class';
import { Subscription } from 'rxjs';
import { BaseWidgetComponent } from '../../../../shared/base.component';

@Component({
    selector: 'dynamic-field',
    templateUrl: './dynamic-field.template.html',
    styleUrls: ['./dynamic-field.styles.scss']
})
export class DynamicFormFieldComponent extends BaseWidgetComponent implements OnChanges {
    @Input() field: DynamicField<any>;
    @Input() form: FormGroup;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.form || changes.field) {
            if (this.subs.obs.control) {
                (this.subs.obs.control as Subscription).unsubscribe();
            }
            if (this.form && this.form.controls[this.field.key] && this.field.control_type !== 'select') {
                const field = this.form.controls[this.field.key];
                this.subs.obs.control = field.valueChanges.subscribe(() => this.performAction());
            }
        }
    }

    get isValid() {
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] : null;
        return control ? control.valid : false;
    }

    get errors() {
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] : null;
        return control ? control.errors : false;
    }

    get dirty() {
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] : null;
        return control ? control.dirty : false;
    }

    get format() {
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] || { value: null } : { value: null };
        return this.field.format ? this.field.format(control.value) : control.value;
    }

    get value() {
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] || { value: null } : { value: null };
        return control.value;
    }

    public performAction() {
        if (this.field.control_type === 'custom') { return; }
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] : { value: null };
        if (this.field.action && this.field.action instanceof Function) {
            const promise = this.field.action(control.value);
            if (promise && promise.then) {
                promise.then((new_value) => this.form.controls[this.field.key].setValue(new_value));
            }
        }
    }
}
