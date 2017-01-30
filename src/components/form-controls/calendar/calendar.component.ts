/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   15/09/2016 6:40 PM
* @Email:  alex@yuion.net
* @Filename: calendar.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 27/01/2017 2:00 PM
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';

const PLACEHOLDER = '-';

@Component({
    selector: 'calendar',
    styleUrls: [ './calendar.style.css' ],
    templateUrl: './calendar.template.html',
    animations: []
})
export class Calendar {
    @Input() date: Date = new Date();
    @Input() minDate: Date = null;
    @Input() futureOnly: boolean = false;
    @Input() display: string;
    @Input() minuteStep: number = 5;
    @Input() color1: string = '#666';
    @Input() color2: string = '#FFF';
    @Output() dateChange = new EventEmitter();
    @Output() finished = new EventEmitter();

    @ViewChild('hourPick') hour_input: ElementRef;
    @ViewChild('minutePick') minute_input: ElementRef;

    months_long = ['Janurary', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    months_short = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    days_long = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    days_short = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    month_node: any[] = [];
    display_year: number = 2016;
    display_month: number = 0;
    display_hour: string = '11';
    display_minutes: string = '59';
    display_period: string = 'PM';
    days: any[] = [];
    months: any[] = [];

    constructor() { }

    ngOnInit() {
        if(this.futureOnly && (this.minDate === null || this.minDate === undefined)) this.minDate = new Date();
        if(this.display == 'short') {
            this.months = this.months_short;
            this.days = this.days_short;
        } else if(this.display == 'long') {
            this.months = this.months_long;
            this.days = this.days_long;
        } else {
            this.months = this.months_long;
            this.days = this.days_short;
        }
    }

    ngOnChanges(changes:any) {
        if(changes.date) {
            if(changes.date.currentValue) {
            	this.setDate(changes.date.currentValue);
            }
        }
    }
    /**
     * Sets the date to the given date and updates the display
     * @param  {Date}   date Date to set
     * @return {void}
     */
    setDate(date: Date) {
        if(!(date instanceof Date)) date = new Date();
        this.date = date;
        this.display_year = this.date.getFullYear();
        this.display_month = this.date.getMonth();
        this.generateMonth();
    }
    /**
     * Check if given day is in the past
     * @param  {number} day [description]
     * @return {boolean} Returns if the given day is in the past
     */
    isPast(day: number) {
        let c_date = new Date();
        c_date.setDate(c_date.getDate()-1);
        let date = new Date(this.display_year, this.display_month, +day);
        return this.compareDates(c_date, date);
    }
    /**
     * Check if given day is after the mininum allowed date
     * @param  {number} day Day of month to check
     * @return {boolean} Returns if the given day is before the set minimum date
     */
    isBeforeMinDate(day: number) {
        if(this.minDate === null) return false;
        let c_date = new Date(this.minDate.getTime());
        c_date.setDate(c_date.getDate()-1);
        let date = new Date(this.display_year, this.display_month, +day);
        return this.compareDates(c_date, date);
    }
    /**
     * Compares two dates
     * @param  {Date}   date1 First date to compare
     * @param  {Date}   date2 Second date to compate
     * @return {boolean} Returns if date1 is before date2
     */
    private compareDates(date1: Date, date2: Date) {
        date1.setHours(23, 59, 59, 0);
        date2.setHours(23, 58, 59, 0);
        return (date1.getTime() > date2.getTime());
    }
    /**
     * Checks if given date is Today
     * @param  {number} day Day of the month to check
     * @return {boolean} Returns if day is today
     */
    isToday(day: number) {
        let now = new Date();
        return (now.getFullYear() === this.display_year &&
                now.getMonth() === this.display_month &&
                now.getDate() === +day);
    }
    /**
     * Check if the given date is the selected one
     * @param  {number} day Day of the month to check
     * @return {boolean} Returns if day is selected
     */
    isActive(day: number) {
        let now = this.date;
        return (now.getFullYear() === this.display_year &&
                now.getMonth() === this.display_month &&
                now.getDate() === +day);
    }
    /**
     * Generates the dates to display for the month that is currently displaying
     * @return {void}
     */
    generateMonth() {
        let firstDay = new Date(this.display_year, this.display_month, 1);
        let monthDays = (new Date(this.display_year, this.display_month+1, 0)).getDate();
        let day = firstDay.getDay();
        this.month_node = [];
        let ph = { day : PLACEHOLDER, valid: false, past: false, today: false, active: false, disabled: false };
        let i: number;
            // Fill in blank days at beginning of the month
        for(i = 0; i < day; i++) this.month_node.push(ph);
            // Fill in days of the month
        for(i = 0; i < monthDays; i++) {
            let day = {
                day : (i+1).toString(),
                valid: true,
                past: this.isPast(i+1),
                today: this.isToday(i+1),
                active: this.isActive(i+1),
                disabled: this.isBeforeMinDate(i+1)
            };
            this.month_node.push(day);
        }
            // Fill in blank days at end of the month
        let cnt = 7 * 6 - this.month_node.length;
        for(i = 0; i < cnt; i++) this.month_node.push(ph);
    }
    /**
     * Changes calendar display to the next month
     * @return {void}
     */
    nextMonth(){
        this.display_month++;
        this.display_month %= 12;
        if(this.display_month == 0) this.display_year++;
        this.generateMonth();
    }
    /**
     * Changes calendar display to the previous month
     * @return {void}
     */
    prevMonth() {
        this.display_month--;
        this.display_month %= 12;
        if(this.display_month == -1) {
            this.display_year--;
            this.display_month = 11;
        }
        this.generateMonth();
    }
    /**
     * Updates the selected day of the month on the calendar display
     * @param  {number} week Week of the month
     * @param  {number} day  Day of the week
     * @return {boolean} Returns whether or not the date is valid to select
     */
    selectDate(week: number, day: number) {
        if(!+this.month_node[week * 7 + day].valid) return false;
        let date = new Date(this.display_year, this.display_month, +this.month_node[week * 7 + day].day);
        if(this.isBeforeMinDate(+this.month_node[week * 7 + day].day)) return false;
        date.setHours(this.date.getHours());
        date.setMinutes(this.date.getMinutes());
        this.setDate(date);
        this.dateChange.emit(date);
        return true;
    }
}
