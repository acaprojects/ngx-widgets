/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   18/11/2016 4:31 PM
 * @Email:  alex@yuion.net
 * @Filename: time-picker.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 01/02/2017 11:44 AM
 */

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import * as moment_api from 'moment';
import { BaseFormWidgetComponent } from '../../../shared/base-form.component';
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
export class TimePickerComponent extends BaseFormWidgetComponent<string> implements OnInit, OnChanges {
    @Input() date: string;
    @Input() duration: number;
    @Input() range = false;
    @Input() manual = true;
    @Output() dateChange = new EventEmitter();
    @Output() durationChange = new EventEmitter();

    public display: { [name: string]: (string | boolean) } = {};

    public ngOnInit() {
        this.data.duration = this.duration;
        if (!this.data.duration) {
            this.data.duration = 60;
        }
        if (!this.data.date) {
            this.data.date = moment();
            this.data.date.minutes(Math.floor(this.data.date.minutes() / 5) * 5);
        }
        if (!this.data.end) {
            this.data.end = moment(this.data.date).add(this.duration || 60, 'm');
        }
        this.generateClockface();
        this.select(TimePickerPeriod.START_HOUR);
        this.data.manual = !this.data.manual;
        this.toggleState();
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (changes.date) {
            const parts = this.date.split(':');
            this.data.date = moment().hours(+parts[0]).minutes(+parts[1]);
            this.data.end = moment(this.data.date).add(this.duration || 60, 'm');
            this.updateDisplay();
        }
        if (changes.duration) {
            this.data.duration = this.duration;
            this.updateEnd();
        }
        if  (changes.manual) {
            this.data.manual = !this.manual;
            this.toggleState();
        }
    }

    /**
     * Generate numbers to display on the clockface
     * @param value Multiples to display
     */
    public generateClockface(value: number = 1, pad: boolean = false) {
        this.data.clock_points = [];
        for (let i = 0; i < 12; i++) {
            const item: any = {
                index: i,
                value: i === 0 && value === 1 ? 12 : i * value
            };
            if (pad) {
                item.value = item.value < 10 ? `0${item.value}` : item.value;
            }
            this.data.clock_points.push(item);
        }
        this.updateDisplay();
    }

    public set(item: any) {
        if (this.data.transition) { return; }
        this.timeout('set', () => {
            this.data.selection = item.index;
            switch(this.data.active.period) {
                case TimePickerPeriod.START_HOUR:
                    this.data.date.hours((+item.value % 12) + (this.data.active.afternoon ? 12 : 0));
                    this.updateEnd();
                    this.data.transition = true;
                    this.timeout('select', () => this.select(1), 800);
                    break;
                case TimePickerPeriod.START_MINUTE:
                    this.data.date.minutes(+item.value);
                    this.updateEnd();
                    break;
                case TimePickerPeriod.END_HOUR:
                    this.data.end.hours((+item.value % 12) + (this.data.active.afternoon ? 12 : 0));
                    this.updateDuration();
                    this.data.transition = true;
                    this.timeout('select', () => this.select(3), 800);
                    break;
                case TimePickerPeriod.END_MINUTE:
                    this.data.end.minutes(+item.value);
                    this.updateDuration();
                    break;
            }
            this.updateDisplay();
        }, 10);
    }

    public select(period: TimePickerPeriod) {
        this.data.transition = false;
        this.data.active = {
            period,
            afternoon: false
        }
        switch(period) {
            case TimePickerPeriod.START_HOUR:
                this.generateClockface()
                this.data.selection = this.data.date.hours() % 12;
                this.data.active.afternoon = this.display.start_afternoon;
                break;
            case TimePickerPeriod.START_MINUTE:
                this.generateClockface(5, true);
                this.data.selection = Math.floor(this.data.date.minutes() / 5);
                this.data.active.afternoon = this.display.start_afternoon;
                break;
            case TimePickerPeriod.END_HOUR:
                this.generateClockface()
                this.data.selection = this.data.end.hours() % 12;
                this.data.active.afternoon = this.display.end_afternoon;
                break;
            case TimePickerPeriod.END_MINUTE:
                this.generateClockface(5, true);
                this.data.selection = Math.floor(this.data.end.minutes() / 5);
                this.data.active.afternoon = this.display.end_afternoon;
                break;
        }
    }

    public togglePeriod(afternoon: boolean = false, name: string = 'date') {
        const hour = this.data[name].hours();
        if (hour >= 12 && !afternoon) { this.data[name].hours(hour % 12); }
        else if (hour < 12 && afternoon) { this.data[name].hours(hour + 12); }
        if (this.data.active) {
            this.data.active.afternoon = afternoon;
        }
        if (name === 'date') {
            this.updateEnd();
        } else {
            this.updateDuration();
        }
        this.updateDisplay();
    }

    public updateDisplay() {
        if (this.data.date) {
            this.display.start_hour = this.data.date.format('hh');
            this.display.start_minute = this.data.date.format('mm');
            this.display.start_afternoon = this.data.date.hours() >= 12;
        }
        if (this.data.end) {
            this.display.end_hour = this.data.end.format('hh');
            this.display.end_minute = this.data.end.format('mm');
            this.display.end_afternoon = this.data.end.hours() >= 12;
        }
        const h = Math.floor((this.data.duration || 60) / 60);
        const m = Math.floor(this.data.duration || 60) % 60;
        this.display.duration = '';
        if (h) { this.display.duration += `${h} hour${h > 1 ? 's' : ''}`; }
        if (m) {
            if (this.display.duration) { this.display.duration += ` `; }
            this.display.duration += `${m} minute${m > 1 ? 's' : ''}`;
        }
    }

    public checkFields(end: boolean = true) {
        this.timeout('check', () => {
                // Check start hour
            if (this.data.start_hour) {
                this.data.error_sh = +this.data.start_hour < 0 || +this.data.start_hour >= 24 || isNaN(this.data.start_hour);
                if (!this.data.error_sh) {
                    this.data.date.hour(+this.data.start_hour);
                }
            }
                // Check start minute
            if (this.data.start_minute) {
                this.data.error_sm = +this.data.start_minute < 0 || +this.data.start_minute >= 60 || isNaN(this.data.start_minute);
                if (!this.data.error_sm) {
                    this.data.date.minute(+this.data.start_minute);
                }
            }
                // Check end hour
            if (this.data.end_hour) {
                this.data.error_eh = +this.data.end_hour < 0 || +this.data.end_hour >= 24 || isNaN(this.data.end_hour);
                if (!this.data.error_eh) {
                    this.data.end.hour(+this.data.end_hour);
                }
            }
                // Check end minute
            if (this.data.end_minute) {
                this.data.error_em = +this.data.end_minute < 0 || +this.data.end_minute >= 60 || isNaN(this.data.end_minute);
                if (!this.data.error_em) {
                    this.data.end.minute(+this.data.end_minute);
                }
            }
            if (end) {
                this.updateDuration()
            } else {
                this.updateEnd();
            }
            this.updateDisplay();
        })
    }

    public toggleState() {
        if (!this.data.date) { return this.timeout('toggle', () => this.toggleState(), 300); }
        this.data.manual = !this.data.manual;
        this.data.start_hour = this.data.date.hours();
        this.data.start_minute = this.data.date.minutes();
        if (this.data.start_minute < 10) { this.data.start_minute = `0${this.data.start_minute}` }
        if (this.data.end) {
            this.data.end_hour = this.data.end.hours();
            this.data.end_minute = this.data.end.minutes();
            if (this.data.end_minute < 10) { this.data.end_minute = `0${this.data.end_minute}` }
            this.select(0);
        }
    }


    private updateEnd() {
        if (this.data.date && this.range) {
            this.data.end = moment(this.data.date);
            this.data.end.add(this.data.duration || 60, 'm');
            this.data.end_hour = this.data.end.hours();
            const m = this.data.end.minutes()
            this.data.end_minute = m < 10 ? `0${m}` : m;
        }
        if (this.data.date) {
            this.dateChange.emit(this.data.date.format('HH:mm'));
        }
        this.updateDisplay();
    }

    private updateDuration() {
        if (this.data.date && this.data.end && this.range) {
            this.data.end.date(this.data.date.date()).add(1, 'd');
            const duration = Math.abs(moment.duration(this.data.end.diff(this.data.date)).asMinutes());
            this.data.duration = duration % (24 * 60);
            if (this.data.end.isBefore(this.data.date)) {
                this.data.duration = 60;
                this.data.date = moment(this.data.end).add(-this.data.duration, 'm');
            }
        }
        if (this.data.duration) {
            this.durationChange.emit(this.data.duration);
        }
        this.updateDisplay();
    }
}
