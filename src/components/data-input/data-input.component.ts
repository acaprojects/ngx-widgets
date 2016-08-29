import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';

@Component({
	selector: 'data-input',
	styles: [ require('./data-input.styles.scss'), require('../global-styles/global-styles.scss') ],
	templateUrl: './data-input.template.html',
	animations : [
        trigger('fieldText', [
            state('focus',  style({'font-size': '0.6em', top: '0.5em'})),
            state('blur',   style({'font-size': '1.0em', top: '1.0em'})),
            transition('blur <=> focus', animate('150ms ease-out'))
        ])
    ]
})
export class DataInput {
		// Input Variables
	@Input() type: string = 'text';
	@Input() model: string = '';
	@Input() placeholder: string = '';
	@Input() format: string = '';
	@Input() color: string = 'blue';
	@Input() primary: string = 'C500';
	@Input() min: number = 0;
	@Input() max: number = 0;
	@Input() step: number = 1;
	@Input() icon: boolean = false;
	@Input() iconSide: string = 'left';
	@Input() lockValue: boolean = false;
	@Input() error: boolean = false;
	@Input() view: boolean = false;
	@Input() regex: any = null;
	@Input() errorMsg: string = 'Input not valid';
	@Input() infoMsg: string = '_';
	@Input() disabled: boolean = false;
	@Input() required: boolean = false;
	@Input() validation: boolean = true;

		// Output Variables
	@Output() modelChange = new EventEmitter();
	@Output() errorChange = new EventEmitter();
	@Output() validate = new EventEmitter();
	@Output() cardType = new EventEmitter();
	@Output() onBlur = new EventEmitter();
	@Output() onFocus = new EventEmitter();

	@ViewChild('input') input: ElementRef;

	display_text: string = '';
	clean_text: string = '';
	info_display: string = '';
	focus: boolean = false;
	card_type: string = 'None';
	success: boolean = false;
	width: number = 12;
	caret: number = 0;
	no_validate: boolean = false;
	focus_timer: any = null;

	numbers: string = '1234567890';
	alphabet: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	alphanumeric: string = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	constructor() {

	}

	ngOnInit() {

	}

	ngOnChanges(changes: any) {
		if(changes.model) {
			this.display_text = this.model;
			this.updateInput();
		}
		if(changes.type) {
			switch(this.type.toLowerCase()) {
				case 'date':
					this.width = (this.format ? this.format.length / 2 + 2 : 12) + (this.icon ? 2 : 0);
					break;
				case 'number':
					this.width = (this.max && this.max > 0 ? this.max.toString().length / 2 + 1.5 : 12) + (this.icon ? 2 : 0);
					break;
				case 'ccard':
					this.width = 11.5 + (this.icon ? 2 : 0);
					break;
				default:
					this.width = 12 + (this.icon ? 2 : 0);
					break;
			}
			if(this.width > 30) this.width = 30;
			else if(this.width < 3) this.width = 3;
		}
		if(changes.infoMsg) {
			this.info_display = this.infoMsg;
		}
	}

	updateInput() {
		this.cleanInput();
		if(this.validateInput()) {
			this.modelChange.emit(this.clean_text);
		} else {
			this.errorChange.emit(true);
		}
	}

	cleanInput() {

	}

	focusInput() {
		if(this.input && !this.disabled) {
			this.input.nativeElement.focus();
			if(this.focus_timer) {
				clearTimeout(this.focus_timer);
				this.focus_timer = null;
			}
			this.focus = true;
			this.onFocus.emit();
		}
	}

	blurInput() {
		if(!this.focus_timer) {
			this.focus_timer = setTimeout(() => {
				this.focus = false;
				this.onBlur.emit();
			}, 100);
		}
	}

	keypress(e) {
    	if(e) {
    		if(e.keyCode == '38' && this.type === 'number') { // Up Arrow
    			let number = parseInt(this.display_text);
    			if(isNaN(number)) number = this.min ? this.min : 0;
    			number += this.step ? this.step : 1;
    			if(this.max && number > this.max) number = this.max;
    			this.display_text = number.toString();
    		} else if(e.keyCode == '40' && this.type === 'number') { // Down Arrow
    			let number = parseInt(this.display_text);
    			if(isNaN(number)) number = typeof this.min === 'number' ? this.min : 0;
    			number -= this.step ? this.step : 1;
    			if(this.min && number < this.min) number = this.min;
    			this.display_text = (number < 0 ? '-' : '')+ number.toString();
    		} else if(e.keyCode == '37' || e.keyCode == '39') { // Left & Right Arrow
    			this.no_validate = true;
    		} 
    	} 
    	this.validateInput();
	}

	setCaretPosition(caretPos) {
		if(!this.input) return;
		let elem = this.input.nativeElement;
	    if(elem != null) {
	        if(elem.createTextRange) {
	            var range = elem.createTextRange();
	            range.move('character', caretPos);
	            range.select();
	        }
	        else {
	            if(elem.selectionStart) {
	                elem.setSelectionRange(caretPos, caretPos);
	            }
	        }
	    }
	}

	validateInput() {
		if(this.no_validate) {
			this.no_validate = false;
			return;
		}
			// Reset error display
		this.error = false;
		this.success = false;
		this.info_display = this.infoMsg;
			// Check validity of input
		let valid = true;
		switch(this.type.toLowerCase()){
			case 'email': // Date
				this.clean_text = this.validateEmail();
				break;
			case 'password': // Date
				this.clean_text = this.validatePassword();
				break;
			case 'date': // Date
				this.clean_text = this.validateDate();
				break;
			case 'number': // Number
				this.clean_text = this.validateNumber();
				break;
			case 'ccard': // Credit/Debit Card
				this.clean_text = this.validateCard();
				break;
			default: // Raw Text
				this.clean_text = this.validateText();
				break;
		}
		if(!this.error && this.required) {
			if(this.clean_text === '') {
				this.error = true;
				this.info_display = this.placeholder + ' is required';
				this.errorChange.emit(true);
			}
		}
		let data = {
			valid: valid,
			data: this.clean_text
		}
		if(!this.validation){
			this.error = false;
			this.info_display = this.infoMsg;
		}
		this.validate.emit(data);
	}

	validateText() {
			// Check field validity
		if(this.max && this.max > 0 && this.display_text && this.display_text.length > this.max) {
			this.error = true;
			this.info_display = this.infoMsg;
			this.errorChange.emit(true);
			if(this.lockValue) {
				this.display_text = this.display_text.slice(0, this.max);
			}
		}
		return this.display_text;
	}

	validateEmail() {
		if(!this.display_text || this.display_text === '' || this.display_text.length < 5) return '';
		let email = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		if(!email.test(this.display_text)) {
			this.error = true;
			this.info_display = 'Invalid e-mail address';
			this.errorChange.emit(true);
		}
		return this.display_text;
	}

	validatePassword() {
		if(!this.display_text || this.display_text === '' || this.display_text.length < 8) return '';
		let passCheck = this.regex ? this.regex : /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,24}$/;
		if(!passCheck.test(this.display_text)) {
			this.error = true;
			this.info_display = 'Invalid password';
			this.errorChange.emit(true);
		} else {
			this.success = true;
			this.info_display = 'Password valid';
		}
		return this.display_text;
	}

	validateDate() {
		return this.display_text;
	}

	validateNumber() {
		if(!this.display_text || this.display_text === '') return '';
		this.display_text = (this.display_text[0] === '-' ? '-' : '') + this.removeInvalidChars(this.display_text, this.numbers);
		let num: number = parseInt(this.display_text);
		if(isNaN(num)) {
			this.error = true;
			this.info_display = 'Not a valid number';
			this.errorChange.emit(true);
		} else if(this.min && num < this.min) {
			this.error = true;
			this.info_display = 'Too small(<' + this.min + ')';
			this.errorChange.emit(true);
			if(this.lockValue) num = this.min;
		} else if(this.max && num > this.max) {
			this.error = true;
			this.info_display = 'Too big(>' + this.max + ')';
			this.errorChange.emit(true);
			if(this.lockValue) num = this.max;
		}
		this.display_text = isNaN(num) ? '' : num.toString();
		return this.display_text;
	}

	validateCard() {
		if(!this.display_text || this.display_text === '') return '';
		this.caret = this.input.nativeElement.selectionStart;
		let len = this.display_text.slice(0, this.caret).split('-').length - 1;
		let number = this.removeInvalidChars(this.display_text, this.numbers);
		if(!number || number === '') {
			this.display_text = '';
			return '';
		}
		if(number.length > 16) number = number.slice(0, 16);
		if(this.checkLuhn(number)) {
			this.card_type = this.getCardType(number);
			this.cardType.emit(this.card_type);
			if(this.card_type !== 'None' && number.length > 12) {
				this.info_display = 'Valid ' + this.card_type;
				this.success = true;
			}
		} else {
			this.error = true;
			this.info_display = 'Invalid Card Number';
			this.errorChange.emit(true);
		}
			// Add seperator
		this.display_text = number.match(/.{1,4}/g).join('-');
		setTimeout(() => {
			let len_new = this.display_text.slice(0, this.caret).split('-').length - 1;
			let diff = this.caret - len;
			let res = diff + Math.floor(diff/4);
			this.setCaretPosition(res);
		}, 50);
		return number;
	}

    getCardType(number){
            //Visa
        if(/^4[0-9]{6,}$/.test(number)) return 'Visa';
            //Mastercard
        else if(/^5[1-5][0-9]{5,}$/.test(number)) return 'MasterCard';
            //American Express
        else if(/^3[47][0-9]{5,}$/.test(number)) return 'American Express';
            //Diners Club
        else if(/^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/.test(number)) return 'Diners Club';
            //Discover
        else if(/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(number)) return 'Discover';
            //JCB
        else if(/^(?:2131|1800|35[0-9]{3})[0-9]{3,}$/.test(number)) return 'JBC';
        return 'None';
    };
        
    checkLuhn(input){
        var sum = 0;
        var numdigits = input.length;
        var parity = numdigits % 2;
        for(var i=0; i < numdigits; i++) {
            var digit = parseInt(input.charAt(i))
            if(i % 2 == parity) digit *= 2;
            if(digit > 9) digit -= 9;
            sum += digit;
        }
        return (sum % 10) == 0;
    };

	removeInvalidChars(str: string, valid: string) {
		if(!str) return '';
		let clean_str = '';
		for(let i = 0; i < str.length; i++) {
			if(valid.indexOf(str[i]) >= 0) {
				clean_str += str[i];
			}
		}
		return clean_str;
	}

}
