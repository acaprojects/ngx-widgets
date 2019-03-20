
import { AbstractControl } from '@angular/forms';
import { Type } from '@angular/core';

export interface IDynamicFieldOptions<T> {
    value?: T;
    key?: string;
    label?: string;
    required?: boolean;
    order?: number;
    width?: string;
    type?: string;
    dirty?: boolean;
    disabled?: boolean;
    icon?: IDynamicFieldIcon;
    validators?: ((AbstractControl) => any)[];
    control_type?: string;
    error_message?: string;
    hide?: boolean;
    refs?: string[];
    options?: any[];
    cmp?: Type<any> | string;
    flex?: boolean;
    readonly?: boolean;
    no_label?: boolean;
    no_status?: boolean;
    no_edit?: boolean;
    edit_only?: boolean;
    attributes?: { name: string, value: string }[];
    match?: string;
    metadata?: { [name: string]: any };
    children?: IDynamicFieldOptions<any>[];
    format?: (value: T) => string;
    action?: (value: T) => Promise<T>;
}

export interface IDynamicFieldIcon {
    type: 'image' | 'img' | 'icon';
    class: string;
    value: string;
    src: string;
}

export class DynamicField<T> {
    public static COMPONENTS: { [name: string]: Type<any> } = {};

    public value: T;
    public key: string;
    public label: string;
    public icon: IDynamicFieldIcon;
    public required: boolean;
    public order: number;
    public width: string;
    public type: string;
    public hide: boolean;
    public dirty: boolean;
    public disabled: boolean;
    public options: any[];
    public refs: string[];
    public control_type: string;
    public validators: ((AbstractControl) => any)[];
    public error_message: string;
    public children: IDynamicFieldOptions<any>[];
    public cmp: Type<any>;
    public flex: boolean;
    public readonly: boolean;
    public no_label: boolean;
    public no_status: boolean;
    public no_edit: boolean;
    public edit_only: boolean;
    public attributes: { name: string, value: string }[];
    public match: string;
    public metadata: { [name: string]: any };
    public format: (value: T) => string;
    public action: (value: T) => Promise<T>;

    constructor(options: IDynamicFieldOptions<T> = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.width = options.width;
        this.type = options.type || '';
        this.control_type = options.control_type || '';
        this.icon = options.icon;
        this.validators = options.validators;
        this.format = options.format;
        this.action = options.action;
        this.options = options.options;
        this.refs = options.refs;
        this.children = options.children;
        this.dirty = options.dirty;
        this.hide = options.hide;
        this.flex = options.flex;
        this.match = options.match;
        this.readonly = options.readonly;
        this.no_label = options.no_label;
        this.no_status = options.no_status;
        this.no_edit = options.no_edit;
        this.edit_only = options.edit_only;
        this.attributes = options.attributes;
        this.metadata = options.metadata;
        if (typeof options === 'string') {
            this.cmp = DynamicField.COMPONENTS[this.cmp as any];
        } else if (options.cmp instanceof Type) {
            this.cmp = options.cmp;
        }
        this.disabled = options.disabled;
    }

    public static registerCustom(name: string, cmp: Type<any>) {
        DynamicField.COMPONENTS[name] = cmp;
    }
}

export class StringValueField extends DynamicField<string> { }
export class NumberValueField extends DynamicField<number> { }
export class ArrayValueField extends DynamicField<any[]> { }
