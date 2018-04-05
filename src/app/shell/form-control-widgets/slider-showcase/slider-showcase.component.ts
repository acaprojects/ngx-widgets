
import { Component } from '@angular/core';

@Component({
    selector: 'slider-showcase',
    templateUrl: './slider-showcase.template.html',
    styleUrls: ['./slider-showcase.styles.scss']
})
export class SliderShowcaseComponent {
    public model: any = {
        title: 'Slider',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-slider'`
            }, {
                name: 'model', type: 'both', description: 'Current value of the slider', data: 'number',
                data_desc: ``,
                example: `26`
            }, {
                name: 'step', type: 'input', description: 'Amount that the value of the slider increases/decreases per step', data: 'number',
                data_desc: ``,
                example: `5`
            }, {
                name: 'min', type: 'input', description: 'Minimum value of the slider', data: 'number',
                data_desc: ``,
                example: `16`
            }, {
                name: 'max', type: 'input', description: 'Maximum value of the slider', data: 'number',
                data_desc: ``,
                example: `255`
            }, {
                name: 'align', type: 'input', description: 'Direction of the slider', data: 'number',
                data_desc: `'horizontal' | 'vertical'`,
                example: `16`
            }
        ],
        inject: '',
        state: {
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;slider name=&quot;volume&quot;
     [(model)]=&quot;active&quot;
     align=&quot;vertical&quot;
     [min]=&quot;255&quot;
     [max]=&quot;65535&quot;
     [step]=&quot;256&quot;
&lt;/slider&gt;`;
    }
}
