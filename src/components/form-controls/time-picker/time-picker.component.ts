import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';

const PLACEHOLDER = '-';

@Component({
    selector: 'time-picker',
    styleUrls: [ './time-picker.style.css' ],
    templateUrl: './time-picker.template.html',
    animations: [
        trigger('dateTime', [
            state('hide', style({'top':'100%'})),
            state('show', style({'top':  '0'})),
            state('open', style({'top':  '0'})),
            transition('show <=> hide', animate('0.5s ease-out'))
        ])
    ]
})
export class TimePicker {
    @Input() display: string;
    @Input() time: { h: number, m: number};
    @Input() minuteStep: number = 5;
    @Input() color1: string = '#666';
    @Input() color2: string = '#FFF';
    @Input() text: string = '';
    @Input() open: string = 'open';
    @Input() select: boolean = false;
    @Output() timeChange = new EventEmitter();
    @Output() selected = new EventEmitter();

    @ViewChild('hourPick') hour_input: ElementRef;
    @ViewChild('minutePick') minute_input: ElementRef;

    display_hour: string = '11';
    display_minutes: string = '59';
    display_period: string = 'PM';

    constructor() {
    }

    ngOnChanges(changes: any) {
    	if(changes.time) {
    		this.setDisplayTime();
    	}
    }

    initTime() {
    	let now = new Date();
    	this.time = {
    		h : now.getHours(),
    		m : now.getMinutes()
    	}
    		// Clean up minutes to represent the set minute step
    	let minMod = this.time.m % this.minuteStep;
    	this.time.m = this.minuteStep * (Math.ceil(this.time.m / this.minuteStep));
    	if(this.time.m >= 60) {
    		this.time.h++;
    		this.time.m %= 60;
    	}
    	this.time.h %= 24;
    	this.setDisplayTime();
    }

    setDisplayTime() {
        let time = `${this.display_hour}:${this.display_minutes} ${this.display_period}`;
    		// Setup display hours
    	this.display_hour = (this.time.h % 12).toString();
    	if(parseInt(this.display_hour) === 0) this.display_hour = '12';
    		// Setup display minutes
    	this.display_minutes = (this.time.m % 60).toString();
    		// Setup display period
    	this.display_period = ((this.time.h / 12 >= 1) ? 'PM' : 'AM');
    	this.checkHour();
    	this.checkMinute();
        let new_time = `${this.display_hour}:${this.display_minutes} ${this.display_period}`;
        if(time !== new_time) {
            this.timeChange.emit(this.time);
        }
    }

    addHour() {
    	this.time.h++;
    	this.time.h %= 24;
    	this.setDisplayTime();
    }

    minusHour() {
    	this.time.h--;
    	if(this.time.h < 0) this.time.h = 23;
    	this.setDisplayTime();
    }

    addMinute() {
    	this.time.m += this.minuteStep;
    	if(this.time.m >= 60) {
    		this.time.h++;
    		this.time.m %= 60;
    	}
    	this.time.h %= 24;
    	this.setDisplayTime();
    }

    minusMinute() {
    	this.time.m -= this.minuteStep;
    	if(this.time.m < 0) {
    		this.time.m = 60 + this.time.m;
    		this.minusHour();
    	}
    	this.setDisplayTime();
    }

    changePeriod() {
        setTimeout(() => {
        	this.time.h += 11;
        	this.addHour();
        }, 20);
    }

    checkNumber(str: string) {
    	let numbers = '1234567890';
    	for(let i = 0; i < str.length; i++) {
    		if(numbers.indexOf(str[i]) < 0) {
    			str = str.substr(0, i-1) + str.substr(i+1, str.length);
    			i--;
    		}
    	}
    	return str;
    }

    validateHour() {
    	this.display_hour = this.checkNumber(this.display_hour);
    	if(this.display_hour === '') return;
    	let hour = parseInt(this.display_hour);
    	if(hour < 0 || hour > 60) this.display_hour = '12';
    	else if(hour === NaN) this.display_hour = '';
    }

    validateMinute() {
    	this.display_minutes = this.checkNumber(this.display_minutes);
    	let minutes = parseInt(this.display_minutes);
    	if(minutes < 0 || minutes > 60) this.display_minutes = '00';
    	else if(minutes === NaN) this.display_minutes = '';
    }

    keyupHour(e: any) {
    	if(e) {
    		if(e.keyCode == '38') { // Up Arrow
    			this.addHour();
    		} else if(e.keyCode == '40') { // Up Arrow
    			this.minusHour();
    		} else this.validateHour();
    	} else this.validateHour();
    }

    keyupMinutes(e: any) {
    	if(e) {
    		if(e.keyCode == '38') { // Up Arrow
    			this.addMinute();
    		} else if(e.keyCode == '40') { // Up Arrow
    			this.minusMinute();
    		} else this.validateMinute();
    	} else this.validateMinute();
    }

    checkHour() {
    	setTimeout(() => {
	    		// Check for value
	    	if(!this.display_hour) this.display_hour = '12';
	    		// Check length
	    	if(this.display_hour.length > 2) this.display_hour = this.display_hour.slice(0, 2);
	    		// Check for valid characters
	    	this.validateHour();
	    		// Check number is valid
	    	if(parseInt(this.display_hour) === NaN || parseInt(this.display_hour) > 12 || parseInt(this.display_hour) < 0 || this.display_hour === '')
	    		this.display_hour = '12';
	    		// Update hours
	    	this.time.h = (parseInt(this.display_hour)%12) + (this.display_period === 'AM' ? 0 : 12);
    	}, 20);
    }

    checkMinute() {
    	setTimeout(() => {
	    		// Check for value
	    	if(!this.display_minutes) this.display_minutes = '00';
	    		// Check length
	    	if(this.display_minutes.length > 2) this.display_minutes = this.display_minutes.slice(0, 2);
	    		// Check for valid characters
	    	this.validateMinute();
	    		// Check number is valid
	    	if(parseInt(this.display_minutes) === NaN || parseInt(this.display_minutes) > 59 || parseInt(this.display_minutes) < 0 || this.display_minutes === '')
	    		this.display_minutes = '00';
	    	if(parseInt(this.display_minutes) < 10)  this.display_minutes = '0' + parseInt(this.display_minutes);
	    		// Update minutes
	    	this.time.m = parseInt(this.display_minutes);
    	}, 20);
    }

    changeFocus() {
    	if(this.hour_input) this.hour_input.nativeElement.blur();
    	this.checkHour();
    	if(this.minute_input) this.minute_input.nativeElement.focus();
    	setTimeout(() => { this.checkHour(); }, 50);
    }

    timeSet() {
    	this.checkHour();
    	this.checkMinute();
        	// Update time value
    	this.timeChange.emit(this.time);
        this.selected.emit(this.time);
    }
    //*/
}
