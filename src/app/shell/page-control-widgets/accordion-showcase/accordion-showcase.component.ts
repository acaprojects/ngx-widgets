
import { Component } from '@angular/core';

@Component({
    selector: 'accordion-showcase',
    templateUrl: './accordion-showcase.template.html',
    styleUrls: ['./accordion-showcase.styles.scss']
})
export class AccordionShowcaseComponent {
    // @Input() public name = '';
    // @Input() public model = true;
    // @Input() public type = '';
    // @Input() public options: IToggleOptions = {};
    // @Input() public disabled = false;
    // @Output() public modelChange = new EventEmitter();
    public model: any = {
        title: 'Accordion',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'format', type: 'input', description: 'Accordion step styles', data: 'string',
                data_desc: `'tabs' | 'buttons'`,
                example: `'tabs'`
            }
        ],
        inject: '',
        state: { }
    };

    public ngOnInit() {
        this.model.inject = `&lt;accordion name=&quot;the-toggle&quot;
     format=&quot;buttons&quot;&gt;
     &lt;accordion-step name=&quot;step-one&quot;
     heading=&quot;Step One&quot;&gt;
         Accordion Step Content
     &lt;/accordion-step&gt;
     &lt;accordion-step name=&quot;step-two&quot;
     heading=&quot;Step Two&quot;&gt;
         Another Accordion Step Content
     &lt;/accordion-step&gt;
&lt;/accordion&gt;`;
    }
}
