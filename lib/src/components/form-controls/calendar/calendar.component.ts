
import { Component, EventEmitter, Input, Output } from '@angular/core';

import * as moment_api from 'moment';
const moment = moment_api;

export interface ICalOptions {
    limit: number; // Number of month that the user can move forward and back
    past: boolean; // Restrict user from selecting dates in the past
    format: {
        day: string, // Formatting for the days of the week
        month: string, // Formatting for the displayed month
    };
}

@Component({
    selector: 'calendar',
    templateUrl: './calendar.template.html',
    styleUrls: ['./calendar.styles.scss'],
})
export class CalendarComponent {
    @Input() public name = '';
    @Input() public date: number; // Unix timestamp with milliseconds
    @Input() public events: any = {};
    @Input() public options: ICalOptions | any;
    @Output() public dateChange: any = new EventEmitter();
    @Output() public change: any = new EventEmitter();

    public model: any = {};
    public display: string;

    public ngOnInit() {
        this.model.offset = 0;
        if (!this.date) {
            this.date = (new Date()).getTime();
        }
        if (!this.options) {
            this.options = {};
        }
        this.generateMonth();
    }

    public ngOnChanges(changes: any) {
        if (changes.date) {
            const now = moment().date(1).hours(0).minutes(0).seconds(0).millisecond(0);
            const duration = moment.duration(moment(this.date).diff(now));
            this.model.offset = duration.months();
            this.generateMonth();
        }
        if (changes.options) {
            if (!this.options) {
                this.options = {};
            }
            this.changeMonth();
        }
        if (changes.events) {
            this.generateMonth();
        }
    }

    public setDate(day: any) {
        const now = moment();
        const date = moment(day.timestamp);
        if (!this.options || this.options.past || (!this.options.past && now.isSameOrBefore(date, 'd'))) {
            this.date = day.timestamp;
            this.dateChange.emit(this.date);
        }
        this.generateMonth();
    }

    public changeMonth(value: number = 0) {
        this.model.offset += value;
        if (this.options && this.options.limit) {
            if (this.model.offset > this.options.limit) {
                this.model.offset = this.options.limit;
            } else if (this.model.offset < -this.options.limit) {
                this.model.offset = -this.options.limit;
            }
        }
        if (!this.options || !this.options.past) {
            if (this.model.offset < 0) {
                this.model.offset = 0;
            }
        }
        this.change.emit(this.model.offset);
        this.generateMonth();
    }

    private generateWeekdays(format: string = 'dd') {
        const week: any[] = [];
        const weekday = moment();
        weekday.date(weekday.date() - weekday.day());
        for (let i = 0; i < 7; i++) {
            week.push(weekday.format(format));
            weekday.add(1, 'days');
        }
        this.model.weekdays = week;
    }

    private generateMonth() {
        const set_date = moment(this.date);
        const date = moment();
        const now = moment();
        now.hours(0).minutes(0).seconds(0).milliseconds(0);
        date.add(this.model.offset || 0, 'months');
        const current_month = date.format('YYYY-MMM');
            // Create display for month
        if (this.options && this.options.format) {
            this.display = date.format(this.options.format.month || 'MMMM YYYY');
            const format = this.options.format.day || 'dd';
            this.generateWeekdays(format);
        } else {
            this.display = date.format('MMMM YYYY');
            this.generateWeekdays();
        }
            // Create displays for weekdays
        date.date(1);
        if (date.day() > 0) {
            date.date(date.date() - date.day());
        }
        const month: any[] = [];
        for (let i = 0; i < 6; i++) {
            const week: any[] = [];
            for (let d = 0; d < 7; d++) {
                const day = {
                    timestamp: date.valueOf(),
                    date: date.date(),
                    active: date.format('YYYY-MM-DD') === set_date.format('YYYY-MM-DD'),
                    past: date.isBefore(now),
                    today: date.format('YYYY-MM-DD') === now.format('YYYY-MM-DD'),
                    events: this.events ? this.events[date.format('YYYY-MM-DD')] || 0 : 0,
                    this_month: date.format('YYYY-MMM') === current_month,
                };
                week.push(day);
                date.add(1, 'days');
            }
            month.push(week);
        }
        this.model.month = month;
    }
}
