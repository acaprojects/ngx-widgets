
import { Component } from '@angular/core';

@Component({
    selector: 'radioset-showcase',
    templateUrl: './radioset-showcase.template.html',
    styleUrls: ['./radioset-showcase.styles.scss']
})
export class RadiosetShowcaseComponent {
    public model: any = {
        title: 'Radioset',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'model', type: 'both', description: 'Index of the active radio button', data: 'number',
                data_desc: ``,
                example: `false`
            }, {
                name: 'list', type: 'input', description: 'List of options for users to select', data: 'string[]',
                data_desc: ``,
                example: `['Option 1', 'Option 2', 'Option 3', 'Option 4']`
            }, {
                name: 'inline', type: 'input', description: 'Display radio buttons inline', data: 'boolean',
                data_desc: ``,
                example: `false`
            }
        ],
        inject: '',
        state: {
            list1: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            list2: ['Inline 1', 'Inline 2', 'Inline 3', 'Inline 4'],
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;radioset name=&quot;question&quot;
     [(model)]=&quot;active&quot;
     [list]=&quot;['Inline 1', 'Inline 2', 'Inline 3', 'Inline 4']&quot;
     [inline]=&quot;true&quot;
&lt;/radioset&gt;`;
    }
}
