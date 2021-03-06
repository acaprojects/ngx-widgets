
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
                example: moment().seconds(0).milliseconds(0).valueOf()
            }, {
                name: 'today', type: 'input', description: 'Timestamp to treat as today. Unix timestamp with milliseconds', data: 'number',
                data_desc: ``,
                example: moment().add(7, 'd').valueOf()
            }, {
                name: 'options', type: 'input', description: 'Type of button to render', data: 'string',
                data_desc: `{
    limit: number; // Number of months that the user can move forward and back
    limit_days: number; // Number of days that the user can move forward and back (precedence over limit)
    past: boolean; // Restrict user from selecting dates in the past
    format: {
        day: string, // Moment formatting for the days of the week
        month: string, // Moment formatting for the displayed month
    };
}`,
                example: `{
    from: ${moment().startOf('d').valueOf()},
    to: ${moment().add(3, 'M').valueOf()},
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
        this.model.today = moment().subtract(10, 'd').valueOf();
        this.model.end = moment().add(3, 'M').valueOf();

        // this.model.date = moment().add(7, 'd').valueOf();
        this.model.events = {};
        this.model.events[moment().add(2, 'd').format('YYYY-MM-DD')] = Math.floor(Math.random() * 4 + 8);
        this.model.events[moment().add(4, 'd').format('YYYY-MM-DD')] = Math.floor(Math.random() * 4 + 8);
        this.model.events[moment().add(6, 'd').format('YYYY-MM-DD')] = Math.floor(Math.random() * 4 + 8);
        this.model.events[moment().add(8, 'd').format('YYYY-MM-DD')] = Math.floor(Math.random() * 4 + 8);
        this.model.events[moment().add(10, 'd').format('YYYY-MM-DD')] = Math.floor(Math.random() * 4 + 8);
        this.model.events[moment().add(12, 'd').format('YYYY-MM-DD')] = Math.floor(Math.random() * 4 + 8);
        this.model.events[moment().add(14, 'd').format('YYYY-MM-DD')] = Math.floor(Math.random() * 4 + 8);
    }

    public log(value) {
        const date = moment(value);
        this.model.display = date.format('DD MMM YYYY');
        console.log(`[CALENDAR] Selected date:`, date.format('DD/MM/YYYY'));
    }
}
