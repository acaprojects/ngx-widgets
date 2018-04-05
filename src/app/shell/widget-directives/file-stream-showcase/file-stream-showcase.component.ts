
import { Component } from '@angular/core';

@Component({
    selector: 'file-stream-showcase',
    templateUrl: './file-stream-showcase.template.html',
    styleUrls: ['./file-stream-showcase.styles.scss']
})
export class FileStreamShowcaseComponent {
    public model: any = {
        title: 'File Stream',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'type', type: 'input', description: 'HTML button type', data: 'string',
                data_desc: ``,
                example: `'submit'`
            }, {
                name: 'format', type: 'input', description: 'Type of button to render', data: 'string',
                data_desc: ``,
                example: `'raised'`
            }, {
                name: 'disabled', type: 'input', description: 'Sets the disabled state of the button', data: 'boolean',
                data_desc: ``,
                example: `false`
            }, {
                name: 'model', type: 'both', description: 'Toggle state of the button', data: 'boolean',
                data_desc: '',
                example: `false`
            }, {
                name: 'toggle', type: 'input', description: 'Sets if the button is togglable', data: 'boolean',
                data_desc: ``,
                example: `false`
            }, {
                name: 'tapped', type: 'output', description: 'Called when the button is clicked', data: 'Event',
                data_desc: '',
                example: ``
            },
        ],
        inject: '',
        map: {
            src: 'assets/australia.svg'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;div file-stream &gt;
&lt;/div&gt;`;
    }
}
