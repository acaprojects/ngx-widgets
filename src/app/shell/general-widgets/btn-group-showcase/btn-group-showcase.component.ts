
import { Component } from '@angular/core';

@Component({
    selector: 'button-group-showcase',
    templateUrl: './btn-group-showcase.template.html',
    styleUrls: ['./btn-group-showcase.styles.scss']
})
export class ButtonGroupShowcaseComponent {
    // @Input() public cssClass = '';
    // @Input() public type = '';
    // @Input() public format = 'raised';
    // @Input() public disabled = false;
    // // Output emitters
    // @Output() public touchreleaseped = new EventEmitter();
    public model: any = {
        title: 'Button Group',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button-group'`
            },
            {
                name: 'items', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string[]',
                data_desc: ``,
                example: `[
    'Button 1',
    'Button 2',
    'Button 3',
    ...
]`
            }, {
                name: 'model', type: 'both', description: 'Index of the active button', data: 'number',
                data_desc: ``,
                example: `3`
            }
        ],
        inject: '',
        map: {
            src: 'assets/australia.svg'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;btn-group [items]=&quot;btns&quot;
     [(model)]=&quot;active_btn&quot;
&lt;/btn-group&gt;`;
    }
}
