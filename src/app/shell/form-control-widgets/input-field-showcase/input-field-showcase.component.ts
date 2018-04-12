
import { Component } from '@angular/core';

@Component({
    selector: 'input-field-showcase',
    templateUrl: './input-field-showcase.template.html',
    styleUrls: ['./input-field-showcase.styles.scss']
})
export class InputFieldShowcaseComponent {
    // @Input() public name = '';
    // @Input() public model: string;
    // @Input() public type = 'text';
    // @Input() public disabled = false;
    // @Input() public mask = '';
    // @Input() public placeholder = '';
    // @Output() public modelChange = new EventEmitter();
    // @Output() public focus = new EventEmitter();
    // @Output() public blur = new EventEmitter();
    public model: any = {
        title: 'Input Field',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-input'`
            }, {
                name: 'model', type: 'both', description: 'String input into the field', data: 'string',
                data_desc: ``,
                example: `'The cat in the hat' || '04 8829 3942'`
            }, {
                name: 'type', type: 'input', description: 'Input field type', data: 'string',
                data_desc: ``,
                example: `'text' |  'number' | 'tel'`
            }, {
                name: 'disabled', type: 'input', description: 'Disabled the input field element', data: 'boolean',
                data_desc: ``,
                example: `true`
            }, {
                name: 'mask', type: 'input', description: 'Mask for the input field which limits the allowed user input', data: 'string',
                data_desc: ``,
                example: `'NN/NN/NNNN'`
            }, {
                name: 'limit', type: 'input', description: 'Max length of the field', data: 'number',
                data_desc: ``,
                example: `'24`
            }, {
                name: 'placeholder', type: 'input', description: 'Placeholder text for the input field', data: 'string',
                data_desc: ``,
                example: `Enter your name`
            }, {
                name: 'focus', type: 'output', description: 'Emits an event when the user has focused on the input field', data: 'Event',
                data_desc: ``,
                example: ``
            }, {
                name: 'blur', type: 'output', description: 'Emits an event when the user has blurred/left the input field', data: 'Event',
                data_desc: ``,
                example: ``
            }
        ],
        inject: '',
        state: {
            active: false,
            in_dev: true
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;input-field name=&quot;basic&quot;
     [(model)]=&quot;value&quot;
     placeholder=&quot;Search for stuff...&quot;
&lt;/input-field&gt;`;
    }
}
