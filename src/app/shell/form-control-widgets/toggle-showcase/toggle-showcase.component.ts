
import { Component } from '@angular/core';

@Component({
    selector: 'toggle-showcase',
    templateUrl: './toggle-showcase.template.html',
    styleUrls: ['./toggle-showcase.styles.scss']
})
export class ToggleShowcaseComponent {
    // @Input() public name = '';
    // @Input() public model = true;
    // @Input() public type = '';
    // @Input() public options: IToggleOptions = {};
    // @Input() public disabled = false;
    // @Output() public modelChange = new EventEmitter();
    public model: any = {
        title: 'Toggle',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'model', type: 'both', description: 'State of the toggle component', data: 'boolean',
                data_desc: ``,
                example: `false`
            }, {
                name: 'type', type: 'input', description: 'Type of toggle element to display. Defaults to \'text\'', data: 'string',
                data_desc: `'ios' | 'android' | 'text'`,
                example: `'ios'`
            }, {
                name: 'disabled', type: 'input', description: 'Disables the toggle component', data: 'boolean',
                data_desc: ``,
                example: `true`
            }, {
                name: 'options', type: 'input', description: 'Options', data: 'object',
                data_desc: `{
    on_text?: string;  // Displayed when text type is in on state
    off_text?: string; // Displayed when text type is in off state
}`,
                example: `{
    on_text: 'Bzzz!!!',
    off_text: 'Zzzz...',
}`
            }
        ],
        inject: '',
        state: {
            list1: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            list2: ['Inline 1', 'Inline 2', 'Inline 3', 'Inline 4'],
        }
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
