
import { Component } from '@angular/core';

@Component({
    selector: 'radio-button-showcase',
    templateUrl: './radio-button-showcase.template.html',
    styleUrls: ['./radio-button-showcase.styles.scss']
})
export class RadioButtonShowcaseComponent {
    public model: any = {
        title: 'Radio Button',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'button-98'`
            }, {
                name: 'model', type: 'both', description: 'State of the  radio button', data: 'boolean',
                data_desc: ``,
                example: `false`
            }, {
                name: 'label', type: 'input', description: 'Label displayed next to the radio button', data: 'string',
                data_desc: ``,
                example: `Option 346`
            }
        ],
        inject: '',
        state: {
            list1: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;radio-btn name=&quot;question&quot;
     [(model)]=&quot;active&quot;
     label=&quot;Mi option&quot;
&lt;/radio-btn&gt;`;
    }
}
