
import { Component } from '@angular/core';

@Component({
    selector: 'tab-group-showcase',
    templateUrl: './tab-group-showcase.template.html',
    styleUrls: ['./tab-group-showcase.styles.scss']
})
export class TabGroupShowcaseComponent {
    // @Input() public name = '';
    // @Input() public model = true;
    // @Input() public type = '';
    // @Input() public options: IToggleOptions = {};
    // @Input() public disabled = false;
    // @Output() public modelChange = new EventEmitter();
    public model: any = {
        title: 'Tab Group',
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
            }
        ],
        inject: '',
        state: { }
    };

    public ngOnInit() {
        this.model.inject = `&lt;tab-group name=&quot;the-toggle&quot;
    format=&quot;buttons&quot;&gt;
    &lt;tab id=&quot;step-two&quot
            [template]="tabone"&gt;
        Tab 1
        &lt;ng-template #tabtwo&gt;Tab Content 1&lt;/ng-template&gt;
    &lt;/tab&gt;
    &lt;tab id=&quot;step-two&quot
            [template]="tabtwo"&gt;
        Tab 2
        &lt;ng-template #tabtwo&gt;Tab Content 2&lt;/ng-template&gt;
    &lt;/tab&gt;
&lt;/tab-group&gt;`;
    }
}
