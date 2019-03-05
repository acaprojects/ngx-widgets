
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
    icon?: IDynamicFieldIcon;
    validators?: ((AbstractControl) => any)[];
    control_type?: string;
    error_message?: string;
    hide?: boolean;
    refs?: string[];
    options?: any[];
    cmp?: Type<any>;
    flex?: boolean;
    readonly?: boolean;
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
    public options: any[];
    public refs: string[];
    public control_type: string;
    public validators: ((AbstractControl) => any)[];
    public error_message: string;
    public children: IDynamicFieldOptions<any>[];
    public cmp: Type<any>;
    public flex: boolean;
    public readonly: boolean;
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
        this.metadata = options.metadata;
        this.cmp = options.cmp;
    }
}

export class StringValueField extends DynamicField<string> { }
export class NumberValueField extends DynamicField<number> { }
export class ArrayValueField extends DynamicField<any[]> { }
