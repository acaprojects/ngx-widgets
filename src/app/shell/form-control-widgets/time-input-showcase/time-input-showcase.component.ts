
import { Component } from '@angular/core';

import * as moment from 'moment';

@Component({
    selector: 'time-input-showcase',
    templateUrl: './time-input-showcase.template.html',
    styleUrls: ['./time-input-showcase.styles.scss']
})
export class TimeInputShowcaseComponent {
    public model: any = {
        title: 'Time Input',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'model', type: 'both', description: 'Timestamp in the format HH:mm', data: 'string',
                data_desc: ``,
                example: `19:25`
            }
        ],
        inject: '',
        dev: true,
        map: {
            src: 'assets/australia.svg'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;time-input name=&quot;common&quot;
     [(input)]=&quot;date&quot;&gt;
&lt;/time-input&gt;`;

    }
}
