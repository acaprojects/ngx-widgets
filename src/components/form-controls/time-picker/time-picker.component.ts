/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   18/11/2016 4:31 PM
 * @Email:  alex@yuion.net
 * @Filename: time-picker.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 01/02/2017 11:44 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';

const PLACEHOLDER = '-';

@Component({
    selector: 'time-picker',
    styleUrls: [ './time-picker.style.css' ],
    templateUrl: './time-picker.template.html',
    animations: [
        trigger('dateTime', [
            state('hide', style({top: '100%'})),
            state('show', style({top:  '0'})),
            state('open', style({top:  '0'})),
            transition('show <=> hide', animate('0.5s ease-out')),
        ]),
    ],
})
export class TimePicker {
    @Input() public display: string;
    @Input() public time: { h: number, m: number} = { h: 23, m: 59 };
    @Input() public minuteStep: number = 5;
    @Input() public select: boolean = false;
    @Input() public cssClass: string = 'default';

    @Output() public timeChange = new EventEmitter();
    @Output() public enter = new EventEmitter();

    public display_hour: string = '11';
    public display_minutes: string = '59';
    public display_period: string = 'PM';

    @ViewChild('hourPick') private hour_input: ElementRef;
    @ViewChild('minutePick') private minute_input: ElementRef;

    constructor(private renderer: Renderer) {
    }

    public ngOnChanges(changes: any) {
        if (changes.time) {
            this.setDisplayTime();
        }
    }
    /**
     * Adds one hour to the time
     * @return {void}
     */
    public addHour() {
        this.time.h++;
            // Make sure hours a with the 24 of a day
        this.time.h %= 24;
        this.setDisplayTime();
    }
    /**
     * Reduces the times hour by one
     * @return {[type]} [description]
     */
    public minusHour() {
        this.time.h--;
            // Make sure hours a with the 24 of a day
        if (this.time.h < 0) {
            this.time.h = 23;
        }
        this.setDisplayTime();
    }
    /**
     * Adds one minute to the time
     * @return {void}
     */
    public addMinute() {
        this.time.m += this.minuteStep;
            // Add to hour if > 60
        if (this.time.m >= 60) {
            this.time.m %= 60;
            this.addHour();
        }
        this.setDisplayTime();
    }
    /**
     * Reduces the time's minutes by one
     * @return {[type]} [description]
     */
    public minusMinute() {
        this.time.m -= this.minuteStep;
        if (this.time.m < 0) {
            this.time.m = 60 + this.time.m;
            this.minusHour();
        }
        this.setDisplayTime();
    }
    /**
     * Changes the period from morning to afternoon(AM -> PM)
     * @return {void}
     */
    public changePeriod() {
        setTimeout(() => {
            this.time.h += 11;
            this.addHour();
        }, 20);
    }
    /**
     * Validates the hour value of the component
     * @return {void}
     */
    public validateHour() {
        this.display_hour = this.checkNumber(this.display_hour);
        if (this.display_hour === '') {
            return;
        }
        const hour = parseInt(this.display_hour, 10);
        if (hour < 0 || hour > 23) {
            this.display_hour = '12';
        } else if (isNaN(hour)) {
            this.display_hour = '';
        }
    }
    /**
     * Validates the minute value of the component
     * @return {void}
     */
    public validateMinute() {
        this.display_minutes = this.checkNumber(this.display_minutes);
        const minutes = parseInt(this.display_minutes, 10);
        if (minutes < 0 || minutes > 60) {
            this.display_minutes = '00';
        } else if (isNaN(minutes)) {
            this.display_minutes = '';
        }
    }
    /**
     * Checks if a key press a been made and updates the hour if an up/down arrow key has been pressed
     * @param  {any}    e Key Up Event
     * @return {void}
     */
    public keyupHour(e: any) {
        if (e) {
            if (e.keyCode === '38') { // Up Arrow
                this.addHour();
            } else if (e.keyCode === '40') { // Up Arrow
                this.minusHour();
            } else {
                this.validateHour();
            }
        } else {
            this.validateHour();
        }
    }

    /**
     * Checks if a key press a been made and updates the minutes if an up/down arrow key has been pressed
     * @param  {any}    e Key Up Event
     * @return {void}
     */
    public keyupMinutes(e: any) {
        if (e) {
            if (e.keyCode === '38') { // Up Arrow
                this.addMinute();
            } else if (e.keyCode === '40') { // Up Arrow
                this.minusMinute();
            } else {
                this.validateMinute();
            }
        } else {
            this.validateMinute();
        }
    }
    /**
     * Change input focus from hours to minutes
     * @return {void}
     */
    public changeFocus() {
        if (this.hour_input) {
            this.renderer.invokeElementMethod(this.hour_input.nativeElement, 'blur', []);
        }
        this.checkHour();
        if (this.minute_input) {
            this.renderer.invokeElementMethod(this.minute_input.nativeElement, 'focus', []);
        }
        setTimeout(() => { this.checkHour(); }, 50);
    }
    /**
     * Called when the time changes
     * @return {void}
     */
    public timeSet() {
        this.checkHour();
        this.checkMinute();
            // Update time value
        this.timeChange.emit(this.time);
        this.enter.emit(this.time);
    }
    /**
     * Updates the time displayed by the component
     * @return {void}
     */
    private setDisplayTime() {
        setTimeout(() => {
            const time = `${this.display_hour}:${this.display_minutes} ${this.display_period}`;
                // Setup display hours
            this.display_hour = (this.time.h % 12).toString();
            if (parseInt(this.display_hour, 10) === 0) {
                this.display_hour = '12';
            }
                // Setup display minutes
            this.display_minutes = (this.time.m % 60).toString();
                // Setup display period
            this.display_period = ((this.time.h / 12 >= 1) ? 'PM' : 'AM');
            this.checkHour();
            this.checkMinute();
            const new_time = `${this.display_hour}:${this.display_minutes} ${this.display_period}`;
            if (time !== new_time) {
                this.timeChange.emit(this.time);
            }
        }, 20);
    }
    /**
     * Initialises the time to the current time
     * @return {void}
     */
    private initTime() {
        const now = new Date();
        this.time = {
            h : now.getHours(),
            m : now.getMinutes(),
        };
            // Clean up minutes to represent the set minute step
        const minMod = this.time.m % this.minuteStep;
        this.time.m = this.minuteStep * (Math.ceil(this.time.m / this.minuteStep));
        if (this.time.m >= 60) {
            this.time.h++;
            this.time.m %= 60;
        }
        this.time.h %= 24;
        this.setDisplayTime();
    }
    /**
     * Checks if the input string is a valid number
     * @param  {string} str String to check
     * @return {string} Returns a string only containing numbers
     */
    private checkNumber(str: string) {
        const numbers = '1234567890';
        for (let i = 0; i < str.length; i++) {
            if (numbers.indexOf(str[i]) < 0) {
                str = str.substr(0, i - 1) + str.substr(i + 1, str.length);
                i--;
            }
        }
        return str;
    }
    /**
     * Checks if the display hour value is valid then updates the time hour value
     * @return {void}
     */
    private checkHour() {
        setTimeout(() => {
                // Check for value
            if (!this.display_hour) {
                this.display_hour = '12';
            }
                // Check length
            if (this.display_hour.length > 2) {
                this.display_hour = this.display_hour.slice(0, 2);
            }
                // Check for valid characters
            this.validateHour();
                // Check number is valid
            if (isNaN(parseInt(this.display_hour, 10)) || parseInt(this.display_hour, 10) > 12
                || parseInt(this.display_hour, 10) < 0 || this.display_hour === '') {

                this.display_hour = '12';
            }
                // Update hours
            this.time.h = (parseInt(this.display_hour, 10) % 12) + (this.display_period === 'AM' ? 0 : 12);
        }, 20);
    }

    /**
     * Checks if the display minutes value is valid then updates the time minutes value
     * @return {void}
     */
    private checkMinute() {
        setTimeout(() => {
                // Check for value
            if (!this.display_minutes) {
                this.display_minutes = '00';
            }
                // Check length
            if (this.display_minutes.length > 2) {
                this.display_minutes = this.display_minutes.slice(0, 2);
            }
                // Check for valid characters
            this.validateMinute();
                // Check number is valid
            if (isNaN(parseInt(this.display_minutes, 10)) || parseInt(this.display_minutes, 10) > 59
                || parseInt(this.display_minutes, 10) < 0 || this.display_minutes === '') {
                    this.display_minutes = '00';
            }
            if (parseInt(this.display_minutes, 10) < 10) {
                this.display_minutes = '0' + parseInt(this.display_minutes, 10);
            }
                // Update minutes
            this.time.m = parseInt(this.display_minutes, 10);
        }, 20);
    }
}
