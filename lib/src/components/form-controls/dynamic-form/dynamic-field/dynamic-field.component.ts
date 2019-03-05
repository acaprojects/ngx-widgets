import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, Validators, AbstractControl } from '@angular/forms';

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

    public ignore: any;

    @ViewChild('input') private input: ElementRef<HTMLInputElement | HTMLTextAreaElement>;

    constructor(private renderer: Renderer2) {
        super();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.form || changes.field) {
            if (this.subs.obs.control) {
                (this.subs.obs.control as Subscription).unsubscribe();
            }
            if (this.form && this.form.controls[this.field.key] && this.field.control_type !== 'select') {
                const field = this.form.controls[this.field.key];
                this.subs.obs.control = field.valueChanges.subscribe(() => this.performAction());
            }
            this.setAttributes();
        }
    }

    get isValid(): boolean {
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] : null;
        return control ? control.valid : false;
    }

    get errors(): { message?: string; [name: string]: boolean | string; } {
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] : null;
        return control ? control.errors : null;
    }

    get count (): string {
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] : null;
        if (control && control.value instanceof Array) {
            return control.value.length.toString();
        }
        return null;
    }

    get dirty(): boolean {
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] : null;
        return control ? control.dirty : false;
    }

    get format(): string {
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] || { value: null } : { value: null };
        return this.field.format ? this.field.format(control.value) : control.value;
    }

    get value() {
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] || { value: null } : { value: null };
        return control.value;
    }

    public performAction() {
        if (this.field.control_type === 'custom') { return; }
        const control = this.form && this.form.controls ? this.form.controls[this.field.key] : null;
        if (this.field.match) {
            const match_control = this.form && this.form.controls ? this.form.controls[this.field.match] : null;
            const validate = (ctrl: AbstractControl) => {
                const error = ctrl.value === control.value;
                return error ? { match: false, message: `${this.field.match}s do not match` } : null;
            }
            match_control.setValidators(this.field.required ? [Validators.required, validate] : [validate]);
        }
        if (control && control.value === this.ignore) {
            return this.timeout('ignore', () => this.ignore = null, 100);
        }
        this.timeout('action', () => {
            if (control && this.field.action && this.field.action instanceof Function) {
                const promise = this.field.action(control.value);
                if (promise && promise.then) {
                    promise.then((new_value) => {
                        this.ignore = new_value;
                        control.setValue(new_value);
                    });
                }
            }
        }, 100);
    }

    private setAttributes(tries: number = 0) {
        if (tries > 20) { return; }
        if (this.field.attributes && this.field.attributes.length > 0) {
            if (this.input && this.input.nativeElement) {
                for (const attr of this.field.attributes) {
                    this.renderer.setAttribute(this.input.nativeElement, attr.name, attr.value);
                }
            } else {
                this.timeout('set_attributes', () => this.setAttributes(++tries));
            }
        }
    }
}
