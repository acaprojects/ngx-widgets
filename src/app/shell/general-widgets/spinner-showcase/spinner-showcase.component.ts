
import { Component } from '@angular/core';

@Component({
    selector: 'spinner-showcase',
    templateUrl: './spinner-showcase.template.html',
    styleUrls: ['./spinner-showcase.styles.scss']
})
export class SpinnerShowcaseComponent {
    // @Input() public progress = 0; // Number between 0 and 1000
    // @Input() public bg = '#CFD8DC';
    // @Input() public color = '#2196F3';
    // @Input() public innerColor = '#2196F3';
    public model: any = {
        title: 'Spinner',
        bindings: [
            {
                name: 'name', type: 'input', description: 'CSS class to add to the root element of the component', data: 'string',
                data_desc: ``,
                example: `'progress-circle-99'`
            }, {
                name: 'type', type: 'input', description: `Type of spinner to display. Valid types are 'plane', 'bounce', 'ring-bounce', 'ring-rotate', 'ring-bounce-in', 'double-bounce', 'bars', 'cubemove', 'cube-grid', 'dot-bounce', 'dot-circle', 'dot-circle-scale'`, data: 'string',
                data_desc: '',
                example: `'dot-bounce'`
            }, {
                name: 'color', type: 'input', description: 'Colour of the spinner', data: 'string',
                data_desc: ``,
                example: `'#fff'`
            }
        ],
        inject: '',
        state: {}
    };

    public ngOnInit() {
        this.model.inject = `&lt;spinner name=&quot;spinner-2&quot;
     color=&quot;#D50000&quot;
     tyoe=&quot;plane&quot;&gt;
&lt;/spinner&gt;`;
    }
}
