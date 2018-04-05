
import { Component } from '@angular/core';

@Component({
    selector: 'modal-showcase',
    templateUrl: './modal-showcase.template.html',
    styleUrls: ['./modal-showcase.styles.scss']
})
export class ModalShowcaseComponent {
    // @Input() public name = '';
    // @Input() public container = 'root';
    // @Input() public cmp: Type<any> = null;
    // @Input() public model: any = {};
    // @Input() public template: TemplateRef<any> = null;
    // @Input() public show = false;
    // @Output() public showChange: any = new EventEmitter();
    // @Output() public event: any = new EventEmitter();
    public model: any = {
        title: 'Modal',
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
                name: 'cmp', type: 'input', description: 'Class of the angular component to render in the modal', data: 'Type<any>',
                data_desc: ``,
                example: `BestModalContentComponent`
            }, {
                name: 'model', type: 'input', description: 'Value set to the model on the component rendered in the modal', data: 'any',
                data_desc: ``,
                example: `{
    param1: 'Something',
    param2: { name: 'Bob' },
    ...
}`
            }, {
                name: 'template', type: 'input', description: 'NgTemplate to render in the model', data: 'TemplateRef<any>',
                data_desc: '',
                example: ``
            }, {
                name: 'show', type: 'both', description: 'Shows/hides the modal', data: 'boolean',
                data_desc: ``,
                example: `true`
            }, {
                name: 'event', type: 'output', description: 'Called when an event is posted by the modal', data: 'object',
                data_desc: `{
    type: string,
    event: Event,
    data: any // reference to the model of the modal
    close: () => void // Closes the modal when called
}`,
                example: `{
    type: 'User',
    event: { ... },
    data: { param1: 'Something', param2: { name: 'Bob' }, ... }
    close: function() {...}
}`
            },
        ],
        inject: '',
        map: {
            src: 'assets/australia.svg'
        },
        state: {}
    };

    public ngOnInit() {
        this.model.inject = `&lt;div modal name="the-modal"
        [template]="template1"
        [(show)]="show_modal" &gt;
&lt;/div&gt;`;
    }
}
