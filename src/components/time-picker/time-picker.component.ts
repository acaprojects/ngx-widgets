import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';

const PLACEHOLDER = '-';

@Component({
    selector: 'time-picker', 
    styles: [ require('./time-picker.style.scss') ],
    templateUrl: './time-picker.template.html',
    animations: [
        trigger('dateTime', [
            state('hide',   style({'top':'100%'})),
            state('show', style({'top':'0'})),
            state('open', style({'top':'0'})),
            transition('* => hide', animate('0.5s ease-out', keyframes([
                style({'top':'0', offset: 0}), style({'top':'100%', offset: 1.0})
            ]))),
            transition('* => show', animate('0.5s ease-in', keyframes([
                style({'top':'100%', offset: 0}), style({'top':'0', offset: 1.0})
            ])))
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
    @Output() timeChange = new EventEmitter();

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
    	this.time.m = this.minuteStep * (Math.round(this.time.m / this.minuteStep));
    	if(this.time.m >= 60) {
    		this.time.h++;
    		this.time.m %= 60;
    	}
    	this.time.h %= 24;
    	this.setDisplayTime();
    }

    setDisplayTime() {
    	console.log(this.time);
    		// Setup display hours
    	this.display_hour = (this.time.h % 12).toString();
    	if(parseInt(this.display_hour) === 0) this.display_hour = '12';
    		// Setup display minutes
    	this.display_minutes = (this.time.m % 60).toString();
    		// Setup display period
    	console.log(this.time.h / 12 >= 1);
    	this.display_period = ((this.time.h / 12 >= 1) ? 'PM' : 'AM');
    	this.checkHour();
    	this.checkMinute();
    }

    addHour() {
    	this.time.h++;
    	this.time.h %= 24;
    	console.log(this.time);
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
    checkNumber(str: string) {
    	console.log('Checking string contains only numbers: ' + str);
    	let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    	for(let i = 0; i < str.length; i++) { 
    		if(numbers.indexOf(str[i]) < 0) {
    			str = str.substr(0, i) + str.substr(i+1, str.length); 
    			i--;
    		}
    	}
    	return str;
    }

    validateHour() {
    	this.display_hour = this.checkNumber(this.display_hour);
    }

    validateMinute() {
    	this.display_minutes = this.checkNumber(this.display_minutes);
    }

    keyupHour(e: any) {
    	if(e) {
    		if(e.keyCode == '38') { // Up Arrow
    			this.addHour();
    		} else if(e.keyCode == '40') { // Up Arrow
    			this.minusHour();
    		} 
    	} else this.validateHour();
    }

    keyupMinutes(e: any) {
    	if(e) {
    		if(e.keyCode == '38') { // Up Arrow
    			this.addMinute();
    		} else if(e.keyCode == '40') { // Up Arrow
    			this.minusMinute();
    		} 
    	} else this.validateMinute();
    }

    checkHour() {
    	console.log('Checking Hour');
    		// Check for value
    	if(!this.display_hour) this.display_hour = '12';
    		// Check length
    	if(this.display_hour.length > 2) this.display_hour = this.display_hour.slice(0, 2);
    		// Check for valid characters
    	this.validateHour();
    		// Check number is valid
    	if(parseInt(this.display_hour) === NaN || parseInt(this.display_hour) > 12 || parseInt(this.display_hour) < 0) 
    		this.display_hour = '12';
    		// Update hours
    	this.time.h = (parseInt(this.display_hour)%12) + (this.display_period === 'AM' ? 0 : 12);
    }

    checkMinute() {
    	console.log('Checking Minutes');
    		// Check for value
    	if(!this.display_minutes) this.display_minutes = '00';
    		// Check length
    	if(this.display_minutes.length > 2) this.display_minutes = this.display_minutes.slice(0, 2);
    		// Check for valid characters
    	this.validateMinute();
    		// Check number is valid
    	if(parseInt(this.display_minutes) === NaN || parseInt(this.display_minutes) > 59 || parseInt(this.display_minutes) < 0) 
    		this.display_minutes = '00';
    	if(parseInt(this.display_minutes) < 10)  this.display_minutes = '0' + parseInt(this.display_minutes);
    		// Update minutes
    	this.time.m = parseInt(this.display_minutes);
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
    }

}
