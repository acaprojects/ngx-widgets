
import { Component } from '@angular/core';

@Component({
    selector: 'tooltip-showcase',
    templateUrl: './tooltip-showcase.template.html',
    styleUrls: ['./tooltip-showcase.styles.scss']
})
export class TooltipShowcaseComponent {
    // @Input() public name = '';
    // @Input() public container = 'root';
    // @Input() public position = 'bottom'; // top, bottom, left, right
    // @Input() public offset = 'middle'; // start, middle, end
    // @Input() public offsetBy = '';
    // @Input() public cmp: Type<any> = null;
    // @Input() public template: TemplateRef<any> = null;
    // @Input() public model: any = {};
    // @Input() public triangle = true;
    // @Input() public show = false;
    // @Input() public auto = false;
    // @Input() public autoclose: any = true;
    // @Input() public hover = false;
    // @Output() public showChange: any = new EventEmitter();
    // @Output() public event: any = new EventEmitter();
    public model: any = {
        title: 'Tooltip',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'position', type: 'input', description: 'Position that the tooltip will render relative to the parent', data: 'string',
                data_desc: `Value can be 'top', 'left', 'bottom', or 'right'`,
                example: `'bottom'`
            }, {
                name: 'offset', type: 'input', description: 'Offset start of the tooltip relative the the position', data: 'string',
                data_desc: `Value can be 'start', 'middle', or 'end'`,
                example: `'middle'`
            }, {
                name: 'OffsetBy', type: 'input', description: 'Units in em to offset the tooltip by', data: 'number',
                data_desc: ``,
                example: `2`
            }, {
                name: 'cmp', type: 'input', description: 'Angular component to render inside the tooltip', data: 'Type<any>',
                data_desc: '',
                example: ``
            }, {
                name: 'template', type: 'input', description: 'Angular template to render inside the tooltip', data: 'NgTemplate',
                data_desc: ``,
                example: ``
            }, {
                name: 'model', type: 'input', description: 'Data to pass to the tooltip component', data: 'any',
                data_desc: '',
                example: ``
            }, {
                name: 'triangle', type: 'input', description: 'Show triangle pointing to parent element', data: 'boolean',
                data_desc: '',
                example: `true`
            }, {
                name: 'show', type: 'both', description: 'Shows the tooltip', data: 'boolean',
                data_desc: '',
                example: `true`
            }, {
                name: 'auto', type: 'input', description: 'Auto position the tooltip relative to the location of the parent on the screen', data: 'boolean',
                data_desc: '',
                example: `false`
            }, {
                name: 'hover', type: 'input', description: 'Show tooltip when the parent element is hovered by the user', data: 'boolean',
                data_desc: '',
                example: `false`
            }, {
                name: 'event', type: 'output', description: 'Events posted by the tooltip component', data: 'IDynamicComponentEvent',
                data_desc: `interface IDynamicComponentEvent {
    id: string;         // ID of the component
    type: string;       // Event type
    location: string;   // Location that the event was thrown from
    data?: any;         // Data value or current state of the content component's model
    model?: any;        // Current state of the content component's model
    value?: any;        // Value posted by event. Use if type is Value
    update: (model: any) => void; // Method to update content component model
    close: () => void;  // Method to close component
}
`,
                example: `{
    id: 'MyTooltip12345',
    type: 'Tap',
    location: 'Outside',
    data: { blah: 'foobar' },
    model: { blah: 'foobar', date: 'Today' },
    value: { blah: 'foobar' },
    update: function(d) { ... }
    close: function() { ... }
}`
            }
        ],
        inject: '',
        map: {
            src: 'assets/australia.svg'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;div tooltip &gt;
        name="the-tooltip"
        [(show)]="show_tooltip"
        [template]="tooltip_template_1",
        position="right"
        offset="start"
        [hover]="true" &gt;
&lt;/div&gt;`;
    }
}
