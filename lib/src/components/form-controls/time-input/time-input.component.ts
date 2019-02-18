import { Component, Input, OnChanges, ViewChild, ElementRef, SimpleChanges, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { BaseFormWidgetComponent } from "../../../shared/base-form.component";

@Component({
    selector: 'time-input',
    templateUrl: './time-input.template.html',
    styleUrls: ['./time-input.styles.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TimeInputComponent),
        multi: true
    }]
})
export class TimeInputComponent extends BaseFormWidgetComponent<string> implements OnChanges, ControlValueAccessor {
    @Input('no-period') public no_period: boolean;
    @Input() public arrows: boolean = true;
    @Input() public step: number = 5;

    public data: { [name: string]: any } = { hour: '12', minute: '00' };

    @ViewChild('hour') public hour_field: ElementRef;
    @ViewChild('minute') public minute_field: ElementRef;

    public ngOnInit() {
        this.data.last_location = 0;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.model && changes.model.previousValue !== this.model) {
            this.setData(this.model);
        }
    }

    public writeValue(value) {
        this.model = value;
        this.setData(this.model);
    }

    public setData(time) {
        const parts = (time || '00:00').split(':');
        this.data.hour = 0;
        this.data.pm = +parts[0] >= 12;
        this.changeHour(+parts[0] % 12, false);
        this.data.minute = 0;
        const minute = Math.ceil(+parts[1] / this.step) % Math.floor(60 / this.step);
        this.changeMinute(minute, false);
    }

    public nextField(e) {
        if (e && e.preventDefault) { e.preventDefault(); }
        if (this.hour_field && this.minute_field) {
            const current = this.hour_field.nativeElement;
            const other = e.key.toLowerCase() !== 'semicolon' && this.data.last_location === (current.value || '').length;
            const right_arrow = e.key.toLowerCase() === 'arrowright' && this.data.last_location === (current.value || '').length;
            if ((other || right_arrow)) {
                const el = this.minute_field.nativeElement;
                el.focus();
                el.selectionStart = el.selectionEnd = 0;
            }
            this.data.last_location = current.selectionEnd;
        }
    }

    public previousField(e) {
        if (e && e.preventDefault) { e.preventDefault(); }
        if (this.hour_field && this.minute_field) {
            const current = this.minute_field;
            const backspace = e.key.toLowerCase() === 'backspace' && this.data.last_location === 0;
            const left_arrow = e.key.toLowerCase() === 'arrowleft' && this.data.last_location === 0;
            if ((backspace || left_arrow) && current.nativeElement.selectionEnd === 0) {
                const el = this.hour_field.nativeElement;
                el.focus();
                el.selectionStart = el.selectionEnd = (el.value || '').length;
            }
            this.data.last_location = current.nativeElement.selectionEnd;
        }
    }

    public checkHour() {
        this.data.hour_error = false;
        if (!this.data.hour) { return true; }
        try {
            JSON.parse(`{ "test": ${this.data.hour} }`);
        } catch (e) {
            this.data.hour_error = true;
            return false;
        }
        if ((+this.data.hour > 12 && !this.no_period) || +this.data.hour > 24 || +this.data.hour < 0) {
            this.data.hour_error = true;
            return false;
        }
        return true;
    }

    public checkMinute() {
        this.data.minute_error = false;
        if (!this.data.minute || this.data.minute === '00') { return true; }
        try {
            const time = this.data.minute.length >= 2 && this.data.minute[0] === '0' ? this.data.minute[1] : this.data.minute;
            JSON.parse(`{ "test": ${time || '""'} }`);
        } catch (e) {
            this.data.minute_error = true;
            return false;
        }
        if (+this.data.minute >= 60) {
            this.data.minute_error = true;
            return false;
        }
        return true;
    }

    public changeHour(value: number, post: boolean = true) {
        if (!this.data.hour || !this.checkHour()) { this.data.hour = '0'; }
        this.data.hour = `${(+this.data.hour % 12) + value || 0}`;
        if (+this.data.hour < 0) {
            this.data.hour = 12 + +this.data.hour % 12;
            this.data.pm = !this.data.pm;
        }
        const hour = (+this.data.hour) + (this.data.pm ? 12 : 0);
            // Check the period of the day
        this.data.pm = hour % 24 >= 12;
        if (!this.no_period) {
            this.data.hour = `${+this.data.hour % 12}`;
        }
            // If hour is zero set it to 12
        if (this.data.hour === '0') { this.data.hour = '12'; }
        if (post) { this.post(); }
    }

    public changeMinute(value: number, post: boolean = true) {
        if (!this.data.minute || !this.checkMinute()) { this.data.minute = '00'; }
        this.data.minute = `${parseInt(this.data.minute) + ((value || 0) * this.step)}`;
        if (+this.data.minute >= 60) {
            this.changeHour(1, post);
        } else if (+this.data.minute < 0) {
            this.changeHour(-1, post);
        }
        this.data.minute = `${+this.data.minute < 0 ? 60 + +this.data.minute : +this.data.minute % 60}`;
        if (+this.data.minute < 10) { this.data.minute = '0' + this.data.minute; }
        if (post) { this.post(); }
    }

    public post() {
        this.timeout('post', () => {
            let hour: number | string = ((+this.data.hour || 0) % 12) + (this.data.pm ? 12 : 0);
            if (+hour < 10) { hour = '0' + hour; }
            const minute = +this.data.minute < 10 ? '0' + +this.data.minute : this.data.minute;
            this.modelChange.emit(`${hour}:${minute}`);
            this.data.post_timer = null;
        }, 50);
    }

}
