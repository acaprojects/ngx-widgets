
import { Component } from '@angular/core';

@Component({
    selector: 'stepper-showcase',
    templateUrl: './stepper-showcase.template.html',
    styleUrls: ['./stepper-showcase.styles.scss']
})
export class StepperShowcaseComponent {
    // @Input() public name = '';
    // @Input() public model = true;
    // @Input() public type = '';
    // @Input() public options: IToggleOptions = {};
    // @Input() public disabled = false;
    // @Output() public modelChange = new EventEmitter();
    public model: any = {
        title: 'Stepper',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'step', type: 'both', description: 'Actively displayed step', data: 'number',
                data_desc: ``,
                example: `0`
            }, {
                name: 'format', type: 'input', description: 'Display format of the stepper', data: 'string',
                data_desc: `'horizontal' | 'vertical'`,
                example: `'ios'`
            }, {
                name: 'numbers', type: 'input', description: 'Display numbers for each of the steps', data: 'number',
                data_desc: ``,
                example: `true`
            }
        ],
        inject: '',
        state: {}
    };

    public ngOnInit() {
        this.model.inject = `&lt;stepper name=&quot;the-toggle&quot;
        [(step)]="step"
        format=&quot;vertical&quot;&gt;
        &lt;stepper-step name=&quot;step-one&quot;
        [(state)]="step[0].state"
        heading=&quot;Step One&quot;&gt;
            Stepper Step Content
        &lt;/stepper-step&gt;
        &lt;stepper-step name=&quot;step-two&quot;
        [(state)]="step[1].state"
        heading=&quot;Step Two&quot;&gt;
            Another Stepper Step Content
        &lt;/stepper-step&gt;
   &lt;/stepper&gt;`;
    }
}
