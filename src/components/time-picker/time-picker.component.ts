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

    display_hour: number = 11;
    display_minutes: number = 59;
    display_period: string = 'PM';
  
    constructor() {
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
    		// Setup display hours
    	this.display_hour = this.time.h % 12;
    	if(this.display_hour === 0) this.display_hour = 12;
    		// Setup display hours
    	this.display_minutes = this.time.m % 60;
    		// Setup display hours
    	this.display_period = this.time.h / 12 >= 1 ? 'PM' : 'AM';
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
    	console.log('Change Period');
    	this.time.h += 11;
    	this.addHour();
    }


    timeSet() {
        	// Update time value
    	this.timeChange.emit(this.time);
    }

}
