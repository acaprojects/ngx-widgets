
import { Component } from '@angular/core';

@Component({
    selector: 'dynamic-form-showcase',
    templateUrl: './dynamic-form-showcase.template.html',
    styleUrls: ['./dynamic-form-showcase.styles.scss']
})
export class DynamicFormShowcaseComponent {
    // @Input() public name = '';
    // @Input() public model = true;
    // @Input() public type = '';
    // @Input() public options: IToggleOptions = {};
    // @Input() public disabled = false;
    // @Output() public modelChange = new EventEmitter();
    public model: any = {
        title: 'Dynamic Form',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'fields', type: 'both', description: 'Array of field metadata used to generate form', data: '',
                data_desc: `{
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
    refs?: string[];
    options?: any[];
    cmp?: Type<any>;
    children?: IDynamicFieldOptions<any>[];
    format?: (value: T) => string;
    action?: (value: T) => Promise<T>;
}[]`,
                example: `[
                    { }`
            }, {
                name: 'validate', type: 'input', description: 'Toggle to force validation of the fields', data: 'boolean',
                data_desc: `'ios' | 'android' | 'text'`,
                example: `'ios'`
            }, {
                name: 'valid', type: 'output', description: 'Emits the validity state of the form', data: 'boolean',
                data_desc: ``,
                example: `true`
            }, {
                name: 'form', type: 'output', description: 'Emits the value of the form fields', data: 'object',
                data_desc: `{
                    [name: string]: any
                }`,
                example: ``
            }
        ],
        inject: '',
        state: [
            { key: 'text', label: 'Text Field', control_type: 'text', required: true },
            { key: 'textarea', label: 'Textarea Field', control_type: 'textarea' },
            { key: 'options', label: 'Dropdown Field', control_type: 'dropdown', options: ['One', 'Two', 'Three', 'Four'] },
            { key: 'toggle', label: 'Toggle Field', control_type: 'toggle' }
        ]
    };

    public ngOnInit() {
        this.model.inject = `&lt;toggle name=&quot;the-toggle&quot;
     [(model)]=&quot;active&quot;
     type=&quot;android&quot;
     [disabled]=&quot;true&quot;
     [options]=&quot;toggle.options&quot;
&lt;/toggle&gt;`;
    }
}
