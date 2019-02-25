
import { Component, EventEmitter, Input, Output, OnChanges, forwardRef, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseFormWidgetComponent } from '../../../shared/base-form.component';

import * as moment_api from 'moment';
const moment = moment_api;

export interface ICalOptions {
    from?: number; // Earliest day that can be selected
    to?: number; // Latest day that can be selected
    format?: {
        day: string, // Formatting for the days of the week
        month: string, // Formatting for the displayed month
    };
}

@Component({
    selector: 'calendar',
    templateUrl: './calendar.template.html',
    styleUrls: ['./calendar.styles.scss'],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CalendarComponent),
        multi: true
      }
    ]
})
export class CalendarComponent extends BaseFormWidgetComponent<number> implements OnChanges, ControlValueAccessor {
    @Input() public date: number; // Unix timestamp with milliseconds
    @Input() public today: number; // Unix timestamp with milliseconds
    @Input() public events: { [name:string]: number } = {};
    @Input() public range: { start: number, end: number }; // Set range as active
    @Input() public options: ICalOptions;
    @Output() public dateChange = new EventEmitter<number>();
    @Output() public month = new EventEmitter<number>();

    public display: string;

    public ngOnInit() {
        this.data.offset = 0;
        if (!this.model) {
            this.model = (new Date()).getTime();
        }
        if (!this.options) {
            this.options = {};
        }
        this.generateMonth();
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (changes.date || changes.model) {
            if (changes.date) { this.model = this.date; }
            const now = moment(this.today).date(1).startOf('d');
            const duration = moment.duration(moment(this.model).diff(now));
            this.data.offset = duration.months();
            this.generateMonth();
        }
        if (changes.options) {
            if (!this.options) { this.options = {}; }
            if (this.options.from) {
                this.data.from = moment(this.options.from);
            } else {
                this.data.from = null;
            }
            if (this.options.to) {
                this.data.to = moment(this.options.to);
            } else {
                this.data.to = null;
            }
            this.changeMonth();
        }
        if (changes.today) {
            const now = moment().startOf('d');
            if (!this.today || this.today < now.valueOf()) {
                this.today = now.valueOf();
            }
        }
        if (changes.events) {
            this.generateMonth();
        }
    }

    /**
     * Update local value when form control value is changed
     * @param value
     */
    public writeValue(value: number) {
        this.setDate({ timestamp: value });
    }

    public setDate(day: { timestamp: number }, emit: boolean = true) {
        if (this.disabled) { return; }
        const now = moment(this.today);
        const date = moment(day.timestamp);
        if ((!this.data.from || date.isSameOrAfter(this.data.from, 'd')) && (!this.data.to || date.isSameOrBefore(this.data.to, 'd'))) {
            this.model = day.timestamp;
            if (emit) {
                this.modelChange.emit(this.model);
                this.dateChange.emit(this.model);
                this.change(this.model)
            }
        }
        this.generateMonth();
    }

    public changeMonth(value: number = 0) {
        let new_month = this.data.offset + value;
        const now = moment().add(new_month, 'M');
        if ((!this.data.from || now.isSameOrAfter(this.data.from, 'M')) &&
            (!this.data.to || now.isSameOrBefore(this.data.to, 'M')))  {
            this.data.offset = new_month
            this.month.emit(this.data.offset);
            this.generateMonth();
        }
    }

    private generateWeekdays(format: string = 'dd') {
        const week: string[] = [];
        const weekday = moment();
        weekday.date(weekday.date() - weekday.day());
        for (let i = 0; i < 7; i++) {
            week.push(weekday.format(format));
            weekday.add(1, 'days');
        }
        this.data.weekdays = week;
    }

    private generateMonth() {
        const set_date = moment(this.model);
        const date = moment();
        const today = moment();
        date.add(this.data.offset || 0, 'M');
        const active_month = moment(date);
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
        const month: { [name: string]: any }[][] = [];
        for (let i = 0; i < 6; i++) {
            const week: { [name: string]: any }[] = [];
            for (let d = 0; d < 7; d++) {
                const day = {
                    timestamp: date.valueOf(),
                    date: date.date(),
                    active: date.isSame(set_date, 'd'),
                    today: date.isSame(today, 'd'),
                    events: this.events ? this.events[date.format('YYYY-MM-DD')] || 0 : 0,
                    disabled: (this.data.from && date.isBefore(this.data.from, 'd')) || (this.data.to && date.isAfter(this.data.to, 'd')),
                    this_month: date.isSame(active_month, 'M'),
                };
                week.push(day);
                date.add(1, 'days');
            }
            month.push(week);
        }
        this.data.month = month;
    }
}
