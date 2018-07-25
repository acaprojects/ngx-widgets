
import { Component } from '@angular/core';

import * as moment from 'moment';

@Component({
    selector: 'time-picker-showcase',
    templateUrl: './time-picker-showcase.template.html',
    styleUrls: ['./time-picker-showcase.styles.scss']
})
export class TimePickerShowcaseComponent {
    public model: any = {
        title: 'Time Picker',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'date', type: 'both', description: 'Timestamp in the format HH:mm', data: 'string',
                data_desc: ``,
                example: `19:25`
            }, {
                name: 'range', type: 'input', description: 'Selecting a time range?', data: 'boolean',
                data_desc: ``,
                example: `true`
            }, {
                name: 'duration', type: 'both', description: 'Number of minutes between the start and end of the time range', data: 'number',
                data_desc: ``,
                example: `120`
            }
        ],
        inject: '',
        dev: true,
        map: {
            src: 'assets/australia.svg'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;time-picker name=&quot;common&quot;
     [(date)]=&quot;date&quot;
     [(duration)]=&quot;duration&quot;
     [range]=&quot;true&quot;&gt;
&lt;/time-picker&gt;`;

    }
}
