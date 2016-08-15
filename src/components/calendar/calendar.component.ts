import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';

const PLACEHOLDER = '-';

@Component({
    selector: 'calendar', 
    styles: [ require('./calendar.style.scss') ],
    templateUrl: './calendar.template.html',
    animations: [
        trigger('dateTime', [
            state('hide',   style({'top':'100%'})),
            state('show', style({'top':'0'})),
            transition('show => hide', animate('0.5s ease-out', keyframes([
                style({'top':'0', offset: 0}), style({'top':'100%', offset: 1.0})
            ]))),
            transition('hide => show', animate('0.5s ease-in', keyframes([
                style({'top':'100%', offset: 0}), style({'top':'0', offset: 1.0})
            ])))
        ])
    ]
})
export class Calendar {
    @Input() date: Date = null;
    @Input() minDate: Date = null;
    @Input() futureOnly: boolean = false;
    @Input() selectTime: boolean = false;
    @Input() display: string;
    @Input() time: { h: number, m: number};
    @Input() minuteStep: number = 5;
    @Input() color1: string = '#666';
    @Input() color2: string = '#FFF';
    @Output() dateChange = new EventEmitter();
    @Output() timeChange = new EventEmitter();

    @ViewChild('hourPick') hour_input: ElementRef;
    @ViewChild('minutePick') minute_input: ElementRef;

    months_long = ['Janurary', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    months_short = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    days_long = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    days_short = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    month_node = [];
    display_year: number = 2016;
    display_month: number = 0;
    display_hour: string = '11';
    display_minutes: string = '59';
    display_period: string = 'PM';
    pick_time: string = 'hide';
    days = [];
    months = [];
  
    constructor() {
    }

    ngOnInit() {
        let now = new Date();
        if(this.futureOnly && (this.minDate === null || this.minDate === undefined)) this.minDate = new Date();
        if(this.date === null || this.date === undefined) this.setDate(now)
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
    	if(changes.time) {
    		this.setDisplayTime();
    	}
    }

    setDate(date: Date) {
    	this.initTime();
        this.date = date;
        this.display_year = this.date.getFullYear();
        this.display_month = this.date.getMonth();
        this.generateMonth();
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

    changePeriod() {
    	console.log('Change Period');
    	this.time.h += 11;
    	console.log(this.time);
    	this.addHour();
    	console.log(this.time);
    }

    isPast(week, day) {
        if(!this.isValid(week, day)) return false;
        let c_date = new Date();
        c_date.setDate(c_date.getDate()-1);
        let date = new Date(this.display_year, this.display_month, +this.month_node[week * 7 + day]);
        return this.compareDates(c_date, date);
    }

    isValid(week, day) {
        return (this.month_node[week * 7 + day] !== PLACEHOLDER);
    }

    isBeforeMinDate(week, day) {
        if(this.minDate === null) return false;
        if(!this.isValid(week, day)) return false;
        let c_date = new Date(this.minDate.getTime());
        c_date.setDate(c_date.getDate()-1);
        let date = new Date(this.display_year, this.display_month, +this.month_node[week * 7 + day]);
        return this.compareDates(c_date, date);
    }

    private compareDates(date1: Date, date2: Date) {
        date1.setHours(23); date1.setMinutes(59); date1.setSeconds(59); date1.setMilliseconds(0);
        date2.setHours(23); date2.setMinutes(58); date2.setSeconds(59); date2.setMilliseconds(0);
        return (date1.getTime() > date2.getTime());
    }

    isToday(week, day) {
        if(!this.isValid(week, day)) return false;
        let now = new Date();
        return (now.getFullYear() === this.display_year && 
                now.getMonth() === this.display_month && 
                now.getDate() === +this.month_node[week * 7 + day]);
    }
    isActive(week, day) {
        if(!this.isValid(week, day)) return false;
        let now = this.date;
        return (now.getFullYear() === this.display_year && 
                now.getMonth() === this.display_month && 
                now.getDate() === +this.month_node[week * 7 + day]);
    }

    generateMonth() {
        let firstDay = new Date(this.display_year, this.display_month, 1);
        let monthDays = (new Date(this.display_year, this.display_month+1, 0)).getDate();
        let day = firstDay.getDay();
        this.month_node = [];
        let i;
        for(i = 0; i < day; i++) this.month_node.push(PLACEHOLDER);
        for(i = 0; i < monthDays; i++) this.month_node.push((i+1).toString());
        let cnt = 7 * 6 - this.month_node.length;
        for(i = 0; i < cnt; i++) this.month_node.push(PLACEHOLDER);
    }

    nextMonth(){
        this.display_month++;
        this.display_month %= 12;
        if(this.display_month == 0) this.display_year++;
        this.generateMonth();
    }

    prevMonth() {
        this.display_month--;
        this.display_month %= 12;
        if(this.display_month == -1) {
            this.display_year--;
            this.display_month = 11;
        }
        this.generateMonth();
    }

    selectDate(week, day) {
        if(!this.isValid(week, day)) return false;
        let date = new Date(this.display_year, this.display_month, +this.month_node[week * 7 + day]);
        if(this.isBeforeMinDate(week, day)) return false;
        this.setDate(date);
        this.initTime();
        console.log(this.selectTime, this.pick_time);
        if(this.selectTime) this.pick_time = 'show';
        console.log(this.selectTime, this.pick_time);
        this.dateChange.emit(date);
        return true;
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
    	this.pick_time = 'hide';
    		// Update Date with hours and minutes
    	this.date.setHours(this.time.h);
    	this.date.setMinutes(this.time.m);
        this.dateChange.emit(this.date);
        	// Update time value
    	this.timeChange.emit(this.time);
    }

    formatDate() {
    	let str = this.date.getTime().toString();
        if(str === undefined || (typeof str != 'string' && typeof str != 'number')) return 'No Date';
        if(parseInt(str) != NaN){
            var date = new Date(+str);
            return (date.getDate() + '/' +  ('0' + (+date.getMonth()+1)).slice(-2) + '/' + date.getFullYear());
        } else if(str.split("/").length == 3) {
            return str;
        } else if(str.split("-").length == 3) {
            var res = str.split("-");
            return ((res[2]) + '/' + res[1] + '/' + res[0]);;
        }
        return 'No Date';
    }
}
