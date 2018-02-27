
import { Component } from '@angular/core';

@Component({
    selector: 'progress-circle-showcase',
    templateUrl: './progress-circle-showcase.template.html',
    styleUrls: ['./progress-circle-showcase.styles.scss']
})
export class ProgressCircleShowcaseComponent {
    // @Input() public progress = 0; // Number between 0 and 1000
    // @Input() public bg = '#CFD8DC';
    // @Input() public color = '#2196F3';
    // @Input() public innerColor = '#2196F3';
    public model: any = {
        title: 'Progress Circle',
        bindings: [
            {
                name: 'name', type: 'input', description: 'CSS class to add to the root element of the component', data: 'string',
                data_desc: ``,
                example: `'progress-circle-99'`
            }, {
                name: 'progress', type: 'input', description: 'Number between 0 and 1000', data: 'number',
                data_desc: '',
                example: `378`
            }, {
                name: 'bg', type: 'input', description: 'Background colour of the progress circle', data: 'string',
                data_desc: ``,
                example: `'submit'`
            }, {
                name: 'color', type: 'input', description: 'Colour of the progress bar', data: 'string',
                data_desc: ``,
                example: `'raised'`
            }, {
                name: 'innerColor', type: 'input', description: 'Colour of the inside of the progress bar', data: 'string',
                data_desc: ``,
                example: `false`
            }
        ],
        inject: '',
        state: {
            progress: Math.floor(Math.random() * 900 + 100),
            bg: '#ccc',
            color: '#D50000',
            innerColor: '#fff'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;progress-circle [progress]=&quot;loading_percent * 10&quot;
     bg=&quot;#ccc&quot;
     color=&quot;#D50000&quot;
     innerColor=&quot;#fff&quot;&gt;
&lt;/progress-circle&gt;`;
    }
}
