
import { Component, Input, Output, OnChanges, EventEmitter, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { DynamicField } from './dynamic-field.class';
import { Subscription } from 'rxjs';
import { BaseWidgetComponent } from '../../../shared/base.component';

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.template.html',
    styleUrls: ['./dynamic-form.styles.scss']
})
export class DynamicFormComponent extends BaseWidgetComponent implements OnChanges, OnInit, OnDestroy {
    @Input() public fields: DynamicField<any>[] = [];
    @Input() public validate: boolean;
    @Output() public form = new EventEmitter();
    @Output() public valid = new EventEmitter();

    public form_group: FormGroup;
    public no_emit: boolean;
    public changes: Subscription[];

    public ngOnInit() {
        this.form_group = this.makeFormGroup(this.fields);
        this.subChanges();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.fields) {
            this.form_group = this.makeFormGroup(this.fields);
            this.subChanges();
        }
        if (changes.validate) {
            this.checkValid(true);
        }
    }

    public ngOnDestroy() {
        super.ngOnDestroy();
        for (const change of (this.changes || [])) {
            if (change instanceof Subscription) {
                change.unsubscribe();
            }
        }
    }

    public makeFormGroup(fields: DynamicField<any>[]) {
        const group: any = {};

        const handleItem = item => {
            let validators = [];
            if (item.required) { validators.push(Validators.required); }
            if (item.validators && item.validators.length > 0) {
                validators = [...validators, ...item.validators];
            }
            if (item.children) {
                item.children.forEach(handleItem);
            }
            group[item.key] = validators && validators.length > 0 ?
                new FormControl({ value: item.value, disabled: item.disabled }, validators) :
                new FormControl({ value: item.value, disabled: item.disabled });
            if (item.dirty) { (group[item.key] as FormControl).markAsDirty(); }
        };

        if (fields && fields instanceof Array) {
            fields.forEach(handleItem);
        }
        this.no_emit = true;
        this.timeout('init', () => this.no_emit = false, 1000);
        return new FormGroup(group);
    }

    public subChanges() {
        for (const change of (this.changes || [])) {
            if (change instanceof Subscription) {
                change.unsubscribe();
            }
        }
        this.changes = [];
        if (this.form_group) {
            Object.keys(this.form_group.controls).forEach(key => {
                const item = this.form_group.controls[key];
                this.changes.push(item.valueChanges.subscribe(() => this.checkValid()));
            });
            this.changes.push(this.form_group.valueChanges.subscribe(() => this.checkValid()));
        }
    }

    public submit() {
        this.checkValid();
        return false;
    }

    public checkValid(mark: boolean = false) {
        this.timeout('check', () => {
            let valid = true;
            if (this.form_group) {
                Object.keys(this.form_group.controls).forEach(key => {
                    const item = this.form_group.controls[key];
                    if (item.invalid) { valid = false; }
                    if (mark) { item.markAsTouched(); }
                });
            }
            this.valid.emit(valid);
            this.emitForm();
        }, 50);
    }

    public emitForm() {
        if (this.no_emit) { return; }
        const form_data: any = {};
        let has_valid_item = false;

        if (this.form_group) {
            Object.keys(this.form_group.controls).forEach(key => {
                const item = this.form_group.controls[key];
                if (item.valid) {
                    has_valid_item = true;
                    form_data[key] = item.value;
                }
            });
            if (has_valid_item) { this.form.emit(form_data); }
        }
    }
}
