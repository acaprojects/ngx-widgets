
import { Component } from '@angular/core';

import * as moment from 'moment';

@Component({
    selector: 'calendar-showcase',
    templateUrl: './calendar-showcase.template.html',
    styleUrls: ['./calendar-showcase.styles.scss']
})
export class CalendarShowcaseComponent {
    public model: any = {
        title: 'Calendar',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-button'`
            }, {
                name: 'date', type: 'both', description: 'Unix timestamp with milliseconds', data: 'number',
                data_desc: ``,
                example: `1519948917000`
            }, {
                name: 'options', type: 'input', description: 'Type of button to render', data: 'string',
                data_desc: `{
    limit: number; // Number of month that the user can move forward and back
    past: boolean; // Restrict user from selecting dates in the past
    format: {
        day: string, // Moment formatting for the days of the week
        month: string, // Moment formatting for the displayed month
    };
}`,
                example: `{
    limit: 3,
    path: false,
    format: {
        day: 'ddd',
        month: 'MMM'
    }
}`
            }
        ],
        inject: '',
        map: {
            src: 'assets/australia.svg'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;calendar name=&quot;common&quot;
     [(date)]=&quot;date&quot;
     [options]=&quot;calendar_options&quot;&gt;
&lt;/calendar&gt;`;

        this.model.events = {};
        this.model.events[moment().add(2, 'd').format('YYYY-MM-DD')] = Math.floor(Math.random() * 4 + 8);
    }
}
