
import { Component } from '@angular/core';

@Component({
    selector: 'dropdown-showcase',
    templateUrl: './dropdown-showcase.template.html',
    styleUrls: ['./dropdown-showcase.styles.scss']
})
export class DropdownShowcaseComponent {
    public model: any = {
        title: 'Dropdown',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'list', type: 'input', description: 'Index of the selected item in the set list', data: 'string[] | object[]',
                data_desc: `[string, string, ...] | [{ name: string, ... }, { name: string, ... }]`,
                example: `[{ name: 'Option 1', ... }, { name: 'Option 2', ... }]`
            }, {
                name: 'model', type: 'both', description: 'Index of the selected item in the set list', data: 'number',
                data_desc: ``,
                example: `2`
            }, {
                name: 'filter', type: 'input', description: 'Add search field to dropdown for filtering a large list of items', data: 'boolean',
                data_desc: ``,
                example: `false`
            }, {
                name: 'placeholder', type: 'input', description: 'Text to display if no item is selected', data: 'string',
                data_desc: ``,
                example: `'Select an item'`
            }
        ],
        inject: '',
        state: {
            active: false,
            list1: ['New South Wales', 'Victoria', 'Queensland', 'Northern Territory', 'Western Australia', 'South Australia', 'Tasmania', 'Australian Capital Territory'],
            list2: ['Today', 'Yesterday', 'Tomorrow', 'In the Future', 'In the Past'],
            list3: []
        }
    };

    public ngOnInit() {
        for(let i = 1; i < 999; i++) {
            this.model.state.list3.push(`Item ${i}`);
        }
        this.model.inject = `&lt;dropdown name=&quot;question&quot;
     [list]=&quot;['Item 1', 'Item 2', 'Item 3', 'Item 4']&quot;
     [(model)]=&quot;active&quot;
     placeholder=&quot;Select a state?&quot;
&lt;/dropdown&gt;`;
    }
}
