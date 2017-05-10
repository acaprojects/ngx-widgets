/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   15/09/2016 6:40 PM
 * @Email:  alex@yuion.net
 * @Filename: calendar.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 27/01/2017 2:00 PM
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';

import * as moment from 'moment';

const PLACEHOLDER = '-';

@Component({
    selector: 'calendar',
    styleUrls: [ './calendar.style.css' ],
    templateUrl: './calendar.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [],
})
export class Calendar {
    @Input() public model: Date = new Date();
    @Input() public minDate: Date = null;
    @Input() public futureOnly: boolean = false;
    @Input() public display: string;
    @Input() public minuteStep: number = 5;
    @Input() public color1: string = '#666';
    @Input() public color2: string = '#FFF';
    @Output() public modelChange = new EventEmitter();
    @Output() public finished = new EventEmitter();

    public months_long = [
        'Janurary', 'Feburary', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    public months_short = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    public days_long = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    public days_short = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    public month_node: any[] = [];
    public display_period: string = '';
    public month: number = 0;
    public days: any[] = [];
    public months: any[] = [];

    constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {
        this.setDate(new Date());
    }

    public ngOnInit() {
        this.generateMonth();
        if (this.futureOnly && (this.minDate === null || this.minDate === undefined)) {
            this.minDate = new Date();
        }
        if (this.display === 'short') {
            this.months = this.months_short;
            this.days = this.days_short;
        } else if (this.display === 'long') {
            this.months = this.months_long;
            this.days = this.days_long;
        } else {
            this.months = this.months_long;
            this.days = this.days_short;
        }
    }

    public ngOnChanges(changes: any) {
        if (changes.model) {
            if (changes.model.currentValue) {
                this.setDate(changes.model.currentValue);
            }
        }
    }

    public change() {
        this.zone.run(() => {
            this.cdr.markForCheck();
        });
    }
    /**
     * Sets the date to the given date and updates the display
     * @param  {Date}   date Date to set
     * @return {void}
     */
    public setDate(date: Date, emit?: boolean) {
        if (!(date instanceof Date)) {
            date = new Date();
        }
        const new_date = moment(date);
        new_date.hour(12);
        new_date.minute(0);
        new_date.second(0);
        this.model = new_date.toDate();
        if (emit) {
            this.modelChange.emit(this.model);
            this.generateMonth();
        }
    }
    /**
     * Check if given day is in the past
     * @param  {number} day [description]
     * @return {boolean} Returns if the given day is in the past
     */
    public isPast(day: string) {
        const date = moment(day);
        return moment().format('YYYY-MM-DD').localeCompare(date.format('YYYY-MM-DD')) > 0;
    }
    /**
     * Check if given day is after the mininum allowed date
     * @param  {number} day Day of month to check
     * @return {boolean} Returns if the given day is before the set minimum date
     */
    public isBeforeMinDate(day: string) {
        if (this.minDate === null) {
            return false;
        }
        const min = moment(this.minDate);
        const date = moment(day);
        return min.format('YYYY-MM-DD').localeCompare(date.format('YYYY-MM-DD')) > 0;
    }
    /**
     * Checks if given date is Today
     * @param  {number} day Day of the month to check
     * @return {boolean} Returns if day is today
     */
    public isToday(day: string) {
        const now = moment();
        const date = moment(day);
        return now.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    }
    /**
     * Check if the given date is the selected one
     * @param  {number} day Day of the month to check
     * @return {boolean} Returns if day is selected
     */
    public isActive(day: string) {
        const now = moment(this.model);
        const date = moment(day);
        return now.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    }

    public isValid(day: string) {
        return !this.isBeforeMinDate(day) && !this.isPast(day);
    }
    /**
     * Changes calendar display to the next month
     * @return {void}
     */
    public nextMonth() {
        this.month++;
        this.generateMonth();
    }
    /**
     * Changes calendar display to the previous month
     * @return {void}
     */
    public prevMonth() {
        this.month--;
        this.generateMonth();
    }

    public resetMonth() {
        this.month = 0;
    }
    /**
     * Updates the selected day of the month on the calendar display
     * @param  {number} week Week of the month
     * @param  {number} day  Day of the week
     * @return {boolean} Returns whether or not the date is valid to select
     */
    public selectDate(date: any) {
        if (!date.valid) {
            return false;
        }
        const new_date = moment();
        new_date.add(this.month, 'months');
        new_date.date(date.date);
        if (this.isBeforeMinDate(new_date.format('YYYY-MM-DD'))) {
            return false;
        }
        this.setDate(new_date.toDate(), true);
        return true;
    }
    /**
     * Generates the dates to display for the month that is currently displaying
     * @return {void}
     */

    private generateMonth() {
        this.month_node = [];
            // Get month information
        const now = moment();
        const current_day = now.date();
        now.date(1);
        now.add(this.month, 'months');
        this.display = now.format('MMMM YYYY');
        const length = now.daysInMonth();
        const start = now.day();
        now.subtract(1, 'months');
        const prev_length = now.daysInMonth();
            // Generate previous month's data
        for (let i = prev_length - start; i < prev_length; i++) {
            this.month_node.push({
                date: i + 1,
                current: false,
            });
        }
        now.add(1, 'months');
            // Generate current month's data
        for (let i = 0; i < length; i++) {
            const today = this.month === 0 && i + 1 === current_day;
            now.date(i + 1);
            const date_moment = now.format('YYYY-MM') + '-' + (i + 1).toString();
            this.month_node.push({
                date: i + 1,
                current: true,
                today: this.isToday(date_moment),
                active: this.isActive(date_moment),
                valid: this.isValid(date_moment),
            });
        }
            // Generate next month's data
        for (let i = 0; this.month_node.length < 42; i++) {
            this.month_node.push({
                date: i + 1,
                current: false,
            });
        }
    }
}
