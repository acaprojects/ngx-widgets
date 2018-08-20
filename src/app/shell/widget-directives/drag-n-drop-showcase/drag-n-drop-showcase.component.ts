
import { Component } from '@angular/core';
import { AppService } from '../../../services/app.service';

@Component({
    selector: 'drag-n-drop-showcase',
    templateUrl: './drag-n-drop-showcase.template.html',
    styleUrls: ['./drag-n-drop-showcase.styles.scss']
})
export class DragNDropShowcaseComponent {
    public model: any = {
        title: 'Drag N Drop',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'todays-modal'`
            }, {
                name: 'container', type: 'input', description: 'Overlay container to attach the modal to. Defaults to root', data: 'string',
                data_desc: ``,
                example: `'overlay-container-29'`
            }, {
                name: 'cmp', type: 'input', description: 'Class of the angular component to render in the notification', data: 'Type<any>',
                data_desc: ``,
                example: `BestNotificationContentComponent`
            }, {
                name: 'model', type: 'input', description: 'Value set to the model on the component rendered in the modal', data: 'any',
                data_desc: ``,
                example: `{
    param1: 'Something',
    param2: { name: 'Bob' },
    ...
}`
            }, {
                name: 'action', type: 'input', description: 'Action button text to display on the notification', data: 'string',
                data_desc: '',
                example: `UNDO`
            }, {
                name: 'timeout', type: 'input', description: 'Timeout in milliseconds in which the notification automatically closes. Set to 0 to disable. Defaults to 0', data: 'number',
                data_desc: '',
                example: `5000`
            }, {
                name: 'template', type: 'input', description: 'NgTemplate to render in the notification', data: 'TemplateRef<any>',
                data_desc: '',
                example: ``
            }, {
                name: 'show', type: 'both', description: 'Shows/hides the modal', data: 'boolean',
                data_desc: ``,
                example: `true`
            }, {
                name: 'event', type: 'output', description: 'Called when action button is pressed by the user', data: 'void',
                data_desc: ``,
                example: ``
            },
        ],
        dev: true,
        inject: '',
        map: {
            src: 'assets/australia.svg'
        },
        state: {}
    };

    constructor(private service: AppService) {  }

    public ngOnInit() {
        this.model.inject = `&lt;div notification name="the-modal"
        [template]="template1"
        [(show)]="show_modal" &gt;
&lt;/div&gt;`;
    }

    public action() {
        this.model.message = Math.floor(Math.random() * 999999);
    }

    public open() {
        const msg = `This is a notification message`;
        this.service.error(msg);
    }
}
