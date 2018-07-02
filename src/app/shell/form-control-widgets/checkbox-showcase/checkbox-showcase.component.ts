
import { Component } from '@angular/core';

@Component({
    selector: 'checkbox-showcase',
    templateUrl: './checkbox-showcase.template.html',
    styleUrls: ['./checkbox-showcase.styles.scss']
})
export class CheckboxShowcaseComponent {
    public model: any = {
        title: 'Checkbox',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'model', type: 'both', description: 'State of the checkbox', data: 'boolean',
                data_desc: ``,
                example: `false`
            }, {
                name: 'label', type: 'input', description: 'Label to display next to the checkbox', data: 'string',
                data_desc: ``,
                example: `'Options 1'`
            }, {
                name: 'side', type: 'input', description: 'Side of the checkbox to display the label', data: 'string',
                data_desc: `'left' | 'right'`,
                example: `'right'`
            }
        ],
        inject: '',
        state: {
            active: false,
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;checkbox name=&quot;question&quot;
     [(model)]=&quot;active&quot;
     label=&quot;Are you an Australian?&quot;&gt;
&lt;/checkbox&gt;`;
    }
}
