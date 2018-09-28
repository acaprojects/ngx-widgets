/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   18/11/2016 4:31 PM
 * @Email:  alex@yuion.net
 * @Filename: time-picker.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 01/02/2017 11:44 AM
 */

import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

import * as moment_api from 'moment';
const moment = moment_api;

export enum TimePickerPeriod {
    START_HOUR,
    START_MINUTE,
    END_HOUR,
    END_MINUTE
}

@Component({
    selector: 'time-picker',
    styleUrls: [ './time-picker.style.scss' ],
    templateUrl: './time-picker.template.html',
})
export class TimePickerComponent implements OnInit, OnChanges {
    @Input() name: string;
    @Input() date: string;
    @Input() duration: number;
    @Input() range = false;
    @Input() manual = true;
    @Output() dateChange = new EventEmitter();
    @Output() durationChange = new EventEmitter();

    public model: any = {};
    public timers: any = {};
    public display: any = {};

    public ngOnInit() {
        this.model.duration = this.duration;
        if (!this.model.duration) {
            this.model.duration = 60;
        }
        if (!this.model.date) {
            this.model.date = moment();
            this.model.date.minutes(Math.floor(this.model.date.minutes() / 5) * 5);
        }
        if (!this.model.end) {
            this.model.end = moment(this.model.date).add(this.duration || 60, 'm');
        }
        this.generateClockface();
        this.select(TimePickerPeriod.START_HOUR);
    }

    public ngOnChanges(changes: any) {
        if (changes.date) {
            const parts = this.date.split(':');
            this.model.date = moment().hours(+parts[0]).minutes(+parts[1]);
            this.model.end = moment(this.model.date).add(this.duration || 60, 'm');
            this.updateDisplay();
        } else if (changes.duration) {
            this.model.duration = this.duration;
            this.updateEnd();
        }
    }
    /**
     * Generate numbers to display on the clockface
     * @param value Multiples to display
     */
    public generateClockface(value: number = 1, pad: boolean = false) {
        this.model.clock_points = [];
        for (let i = 0; i < 12; i++) {
            const item: any = {
                index: i,
                value: i === 0 && value === 1 ? 12 : i * value
            };
            if (pad) {
                item.value = item.value < 10 ? `0${item.value}` : item.value;
            }
            this.model.clock_points.push(item);
        }
        this.updateDisplay();
    }

    public set(item: any) {
        if (this.model.transition) { return; }
        setTimeout(() => {
            this.model.selection = item.index;
            switch(this.model.active.period) {
                case TimePickerPeriod.START_HOUR:
                    this.model.date.hours((+item.value % 12) + (this.model.active.afternoon ? 12 : 0));
                    this.updateEnd();
                    this.model.transition = true;
                    setTimeout(() => this.select(1), 800);
                    break;
                case TimePickerPeriod.START_MINUTE:
                    this.model.date.minutes(+item.value);
                    this.updateEnd();
                    break;
                case TimePickerPeriod.END_HOUR:
                    this.model.end.hours((+item.value % 12) + (this.model.active.afternoon ? 12 : 0));
                    this.updateDuration();
                    this.model.transition = true;
                    setTimeout(() => this.select(3), 800);
                    break;
                case TimePickerPeriod.END_MINUTE:
                    this.model.end.minutes(+item.value);
                    this.updateDuration();
                    break;
            }
            this.updateDisplay();
        }, 10);
    }

    public select(period: TimePickerPeriod) {
        this.model.transition = false;
        this.model.active = {
            period,
            afternoon: false
        }
        switch(period) {
            case TimePickerPeriod.START_HOUR:
                this.generateClockface()
                this.model.selection = this.model.date.hours() % 12;
                this.model.active.afternoon = this.display.start.afternoon;
                break;
            case TimePickerPeriod.START_MINUTE:
                this.generateClockface(5, true);
                this.model.selection = Math.floor(this.model.date.minutes() / 5);
                this.model.active.afternoon = this.display.start.afternoon;
                break;
            case TimePickerPeriod.END_HOUR:
                this.generateClockface()
                this.model.selection = this.model.end.hours() % 12;
                this.model.active.afternoon = this.display.end.afternoon;
                break;
            case TimePickerPeriod.END_MINUTE:
                this.generateClockface(5, true);
                this.model.selection = Math.floor(this.model.end.minutes() / 5);
                this.model.active.afternoon = this.display.end.afternoon;
                break;
        }
    }

    public togglePeriod(afternoon: boolean = false, name: string = 'date') {
        const hour = this.model[name].hours();
        if (hour >= 12 && !afternoon) { this.model[name].hours(hour % 12); }
        else if (hour < 12 && afternoon) { this.model[name].hours(hour + 12); }
        if (this.model.active) {
            this.model.active.afternoon = afternoon;
        }
        if (name === 'date') {
            this.updateEnd();
        } else {
            this.updateDuration();
        }
        this.updateDisplay();
    }

    public updateDisplay() {
        if (this.model.date) {
            this.display.start = {
                hour: this.model.date.format('hh'),
                minute: this.model.date.format('mm'),
                afternoon: this.model.date.hours() >= 12
            }
        }
        if (this.model.end) {
            this.display.end = {
                hour: this.model.end.format('hh'),
                minute: this.model.end.format('mm'),
                afternoon: this.model.end.hours() >= 12
            }
        }
        const h = Math.floor((this.model.duration || 60) / 60);
        const m = Math.floor(this.model.duration || 60) % 60;
        this.display.duration = '';
        if (h) { this.display.duration += `${h} hour${h > 1 ? 's' : ''}`; }
        if (m) {
            if (this.display.duration) { this.display.duration += ` `; }
            this.display.duration += `${m} minute${m > 1 ? 's' : ''}`;
        }
    }

    public checkFields(end: boolean = true) {
        if (this.timers.check) {
            clearTimeout(this.timers.check);
        }
        this.timers.check = setTimeout(() => {
                // Check start hour
            if (this.model.start_hour) {
                this.model.error_sh = +this.model.start_hour < 0 || +this.model.start_hour >= 24 || isNaN(this.model.start_hour);
                if (!this.model.error_sh) {
                    this.model.date.hour(+this.model.start_hour);
                }
            }
                // Check start minute
            if (this.model.start_minute) {
                this.model.error_sm = +this.model.start_minute < 0 || +this.model.start_minute >= 60 || isNaN(this.model.start_minute);
                if (!this.model.error_sm) {
                    this.model.date.minute(+this.model.start_minute);
                }
            }
                // Check end hour
            if (this.model.end_hour) {
                this.model.error_eh = +this.model.end_hour < 0 || +this.model.end_hour >= 24 || isNaN(this.model.end_hour);
                if (!this.model.error_eh) {
                    this.model.end.hour(+this.model.end_hour);
                }
            }
                // Check end minute
            if (this.model.end_minute) {
                this.model.error_em = +this.model.end_minute < 0 || +this.model.end_minute >= 60 || isNaN(this.model.end_minute);
                if (!this.model.error_em) {
                    this.model.end.minute(+this.model.end_minute);
                }
            }
            if (end) {
                this.updateDuration()
            } else {
                this.updateEnd();
            }
            this.updateDisplay();
            this.timers.check = null;
        }, 300)
    }

    public toggleState() {
        this.model.manual = !this.model.manual;
        this.model.start_hour = this.model.date.hours();
        this.model.start_minute = this.model.date.minutes();
        this.model.end_hour = this.model.end.hours();
        this.model.end_minute = this.model.end.minutes();
        this.select(0);
    }


    private updateEnd() {
        if (this.model.date && this.range) {
            this.model.end = moment(this.model.date);
            this.model.end.add(this.model.duration || 60, 'm');
            this.model.end_hour = this.model.end.hours();
            this.model.end_minute = this.model.end.minutes();
        }
        if (this.model.date) {
            this.dateChange.emit(this.model.date.format('HH:mm'));
        }
        this.updateDisplay();
    }

    private updateDuration() {
        if (this.model.date && this.model.end && this.range) {
            this.model.end.date(this.model.date.date());
            const duration = Math.abs(moment.duration(this.model.end.diff(this.model.date)).asMinutes());
            this.model.duration = duration;
            if (this.model.end.isBefore(this.model.date)) {
                this.model.duration = 60;
                this.model.date = moment(this.model.end).add(-this.model.duration, 'm');
            }
        }
        if (this.model.duration) {
            this.durationChange.emit(this.model.duration);
        }
        this.updateDisplay();
    }
}
