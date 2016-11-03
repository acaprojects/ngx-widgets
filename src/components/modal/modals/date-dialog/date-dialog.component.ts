import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { ModalService } from '../../../../services';
import { Modal } from '../../modal.component';

const PLACEHOLDER = '-';

@Component({
    selector: 'date-dialog',
    styleUrls: [ './date-dialog.styles.css', '../../../material-styles/material-styles.css' ],
    templateUrl: './date-dialog.template.html',
    animations: [
        trigger('backdrop', [
            state('hide',   style({'opacity' : '0'})),
            state('show', style({'opacity' : '1' })),
            transition('* => hide', animate('0.5s ease-out', keyframes([
                style({'bac' : '1', offset: 0}), style({'opacity' : '0', offset: 1.0})
            ]))),
            transition('* => show', animate('0.5s ease-in', keyframes([
                style({'opacity' : '0', offset: 0}), style({'opacity' : '1', offset: 1.0})
            ])))
        ]),
        trigger('space', [
            state('hide',   style({ 'left': '100%', 'opacity' : '0'})),
            state('show', style({ 'left':   '50%', 'opacity' : '1' })),
            transition('* => hide', animate('0.5s ease-out', keyframes([
                style({'left': '50%', 'opacity' : '1', offset: 0}), style({'left': '100%', 'opacity' : '0', offset: 1.0})
            ]))),
            transition('* => show', animate('0.5s ease-in', keyframes([
                style({'left': '100%', 'opacity' : '0', offset: 0}), style({'left': '50%', 'opacity' : '1', offset: 1.0})
            ])))
        ])
    ]
})
export class DateDialog extends Modal {
    @Input() date: Date = new Date();
    @Input() minDate: Date = null;
    @Input() futureOnly: boolean = false;
    @Input() display: string;
    @Input() color: string = 'teal';
    @Input() primary: string = 'C500';
    @Output() dateChange = new EventEmitter();
    confirm: any = { text: 'OK', fn: null };
    cancel:  any = { text: 'CANCEL', fn: null };

    months_long = ['Janurary', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    months_short = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    days_long = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    days_short = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    @ViewChild('content') content: ElementRef;

    month_node: any[] = [];
    display_year: number = 2016;
    display_month: number = 0;
    days: any[] = [];
    months: any[] = [];

    constructor(public _cfr: ComponentFactoryResolver) {
        super(_cfr);
    }

    ngOnInit() {
        this.setDate(new Date());
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

    setDate(date: Date) {
        if(!(date instanceof Date)) date = new Date();
        this.date = date;
        this.display_year = this.date.getFullYear();
        this.display_month = this.date.getMonth();
        this.generateMonth();
    }

    isPast(day: number) {
        let c_date = new Date();
        c_date.setDate(c_date.getDate()-1);
        let date = new Date(this.display_year, this.display_month, +day);
        return this.compareDates(c_date, date);
    }

    isBeforeMinDate(day: number) {
        if(this.minDate === null) return false;
        let c_date = new Date(this.minDate.getTime());
        c_date.setDate(c_date.getDate()-1);
        let date = new Date(this.display_year, this.display_month, +day);
        return this.compareDates(c_date, date);
    }

    private compareDates(date1: Date, date2: Date) {
        date1.setHours(23); date1.setMinutes(59); date1.setSeconds(59); date1.setMilliseconds(0);
        date2.setHours(23); date2.setMinutes(58); date2.setSeconds(59); date2.setMilliseconds(0);
        return (date1.getTime() > date2.getTime());
    }

    isToday(day: number) {
        let now = new Date();
        return (now.getFullYear() === this.display_year &&
        now.getMonth() === this.display_month &&
        now.getDate() === +day);
    }
    isActive(day: number) {
        let now = this.date;
        return (now.getFullYear() === this.display_year &&
        now.getMonth() === this.display_month &&
        now.getDate() === +day);
    }

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

    selectDate(week: number, day: number) {
        if(!+this.month_node[week * 7 + day].valid) return false;
        let date = new Date(this.display_year, this.display_month, +this.month_node[week * 7 + day].day);
        if(this.isBeforeMinDate(+this.month_node[week * 7 + day].day)) return false;
        date.setHours(this.date.getHours());
        date.setMinutes(this.date.getMinutes());
        this.setDate(date);
        this.dateChange.emit(date);
        this.data.data.date = this.date;
        return true;
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

    setParams(data: any) {
        super.setParams(data);
        if(data && data.data && data.data.date) this.date = data.data.date;
        this.close = true;
        if(data && data.options){
            for(let i = 0; i < data.options.length; i++) {
                let option = data.options[i];
                if(option.type === 'confirm') {
                    this.confirm = option;
                } else if(option.type === 'cancel') {
                    this.cancel = option;
                }
            }
        }
    }
}
