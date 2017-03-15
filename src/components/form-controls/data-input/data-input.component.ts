/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: data-input.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 27/01/2017 5:30 PM
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';

@Component({
	selector: 'data-input',
	styleUrls: [ './data-input.styles.css', '../../material-styles/material-styles.css' ],
	templateUrl: './data-input.template.html',
	animations : [
        trigger('fieldText', [
            state('focus',  style({'font-size': '0.6em', top: '-0.5em'})),
            state('blur',   style({'font-size': '1.0em', top: '0.4em'})),
            transition('blur <=> focus', animate('150ms ease-out'))
        ])
    ]
})
export class DataInput {
		// Input Variables
	@Input() type: string = 'text';
	@Input() name: string = '';
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
	@Input() infoMsg: string = '';
	@Input() disabled: boolean = false;
	@Input() required: boolean = false;
	@Input() validation: boolean = true;
	@Input() decimals: boolean = true;
	@Input() theme: string = 'light';
	@Input() width: number = null;
	@Input() readonly: boolean = false;

		// Output Variables
	@Output() modelChange = new EventEmitter();
	@Output() errorChange = new EventEmitter();
	@Output() validate = new EventEmitter();
	@Output() cardType = new EventEmitter();
	@Output() onBlur = new EventEmitter();
	@Output() onFocus = new EventEmitter();
		// Input Field
	@ViewChild('input') input: ElementRef;

	display_text: string = '';
	clean_text: string = '';
	info_display: string = '';
	focus: boolean = false;
	card_type: string = 'None';
	success: boolean = false;
	caret: number = 0;
	no_validate: boolean = false;
	focus_timer: any = null;
	validate_timer: any = null;
	backspace: boolean = false;
	fresh: boolean = true;
	_width: number = 12;
	is_password: boolean = false;
	is_number: boolean = false;

	numbers: string = '1234567890';
	alphabet: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	alphanumeric: string = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

	constructor(private renderer: Renderer) {

	}

	ngOnInit() {
		this.fresh = true;
	}

	ngOnChanges(changes: any) {
		setTimeout(() => {
			if(changes.model) {
				this.display_text = this.model;
				//this.validateInput();
			}
			if(changes.type) {
				this.is_password = false;
				this.is_number = false;
				this._width = this.width + (this.icon ? 2 : 0);
				switch(this.type.toLowerCase()) {
					case 'date':
						this._width = (this.format ? this.format.length / 2 + 2 : 12) + (this.icon ? 2 : 0);
						break;
					case 'number':
						if(this.width) {
							this._width = this.width + (this.icon ? 2 : 0);
						} else {
							this._width = (this.max && this.max > 0 ? this.max.toString().length / 2 + 1.5 : 12) + (this.icon ? 2 : 0);
						}
						this.is_number = true;
						break;
					case 'ccard':
						this._width = 11.5 + (this.icon ? 2 : 0);
						break;
					case 'tel':
						this.is_number = true;
						break;
					case 'password':
						this.is_password = true;
						break;
				}
				if(this._width > 30) this._width = 30;
				else if(this._width < 3) this._width = 3;
			}
			if(changes.infoMsg) {
				this.info_display = this.infoMsg;
			}
			if(changes.error) {
				if(this.error) {
					this.info_display = this.errorMsg;
				} else {
					this.info_display = this.infoMsg;
				}
			}
		})
	}
	/**
	 * Focuses on the input field if the field is not disabled or readonly
	 * @return {void}
	 */
	focusInput() {
		if(this.input && !this.disabled && !this.readonly) {
			this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
			if(this.focus_timer) {
				clearTimeout(this.focus_timer);
				this.focus_timer = null;
			}
			this.focus = true;
			this.onFocus.emit();
		} else {
			this.renderer.invokeElementMethod(this.input.nativeElement, 'blur', []);
		}
	}
	/**
	 * Blurs the input field
	 * @return {void}
	 */
	blurInput() {
		if(!this.focus_timer) {
			this.focus_timer = setTimeout(() => {
				this.focus = false;
				this.onBlur.emit();
			}, 100);
		}
	}
	/**
	 * Handles keypresses in input field
	 * @param  {any}    e Key press event
	 * @return {void}
	 */
	keypress(e: any) {
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
    		} else if(e.keyCode == '8') {
    			this.backspace = true;
    		}
    	}
    	if(this.validate_timer) {
    		clearTimeout(this.validate_timer);
    		this.validate_timer = null;
    	}
		this.validate_timer = setTimeout(() => {
			this.validateInput();
			this.validate_timer = null;
		}, 100);
	}
	/**
	 * Gets the focus status of the input field
	 * @return {string} Returns focus if the input field is focused else blur is returned
	 */
	checkFocus() {
		return (this.focus || (this.display_text && this.display_text !== '') ? 'focus': 'blur');
	}
	/**
	 * Sets the position of the input cursor/caret inside the field
	 * @param  {number} caretPos Index in the text to set the cursor
	 * @return {void}
	 */
	setCaretPosition(caretPos: number) {
		if(!this.input) return;
		let elem = this.input.nativeElement;
	    if(elem != null) {
	        if(elem.createTextRange) {
	            var range = elem.createTextRange();
	            range.move('character', caretPos);
	            range.select();
	        }
	        else {
	            this.renderer.invokeElementMethod(elem, 'setSelectionRange', [caretPos, caretPos]);
	        }
	    }
	}
	/**
	 * Checks the validity of the input field content based of the set type
	 * @return {void}
	 */
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
		if(this.clean_text && this.clean_text.length > 1) this.fresh = false;
		this.validate.emit(data);
		this.modelChange.emit(this.clean_text);
	}
	/**
	 * Validate text field input value
	 * @return {string} Returns the valid input value
	 */
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
	/**
	 * Validate an email address input value
	 * @return {string} Returns a valid input value
	 */
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

	/**
	 * Validate an password input value
	 * @return {string} Returns a valid input value
	 */
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

	/**
	 * Validate an date input value
	 * @return {string} Returns a valid input value
	 */
	validateDate() {
		return this.display_text;
	}
	/**
	 * Validate numerical value
	 * @return {void}
	 */
	validateNumber() {
		if(!this.display_text || this.display_text === '') return '';
		let valid_numbers = this.numbers + '.';
		this.display_text = (this.display_text[0] === '-' ? '-' : '') + this.removeInvalidChars(this.display_text, this.decimals ? valid_numbers : this.numbers);
		let decimal = this.display_text[this.display_text.length-1]==='.';
		let num: number = +(this.display_text);
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
		this.display_text = (isNaN(num) ? '' : num.toString()) + (decimal?'.':'');
		return this.display_text;
	}

	/**
	 * Validate Credit/Debit card input value
	 * @return {string} Returns a valid input value
	 */
	validateCard() {
		if(!this.display_text || this.display_text === '') return '';
		this.caret = this.input.nativeElement.selectionStart;
		let len = this.display_text.length;
		let num = this.removeInvalidChars(this.display_text, this.numbers);
		if(!num || num === '') {
			this.display_text = '';
			return '';
		}
		if(num.length > 16) num = num.slice(0, 16);
		if(this.checkLuhn(num)) {
			this.card_type = this.getCardType(num);
			this.cardType.emit(this.card_type);
			if(this.card_type !== 'None' && num.length > 12) {
				this.info_display = 'Valid ' + this.card_type;
				this.success = true;
			}
		} else if(num.length > 10){
			this.error = true;
			this.info_display = 'Invalid Card Number';
			this.errorChange.emit(true);
		}
			// Add seperator
		this.display_text = num.match(/.{1,4}/g).join('-');
		setTimeout(() => {
			let len_new = this.display_text.length;
			let diff = len_new - len;
			let caretDiff = len_new - this.caret;
			let sep_cnt = this.display_text.split('-').length - 1;
			if(caretDiff > 1 && diff != 0) {
				diff = (((this.caret - sep_cnt) / 4) < sep_cnt) ? 0 : diff;
			} else if(diff === 0 && caretDiff > 1 && (this.caret % 5) === 0 && !this.backspace) {
				diff = 1;
			}
			this.setCaretPosition(this.caret + diff);
			this.backspace = false;
		}, 50);
		return num;
	}
	/**
	 * Gets the type of the given Credit/Debit card number
	 * @param  {string} num Card number
	 * @return {string} Returns the named type of the card
	 */
    private getCardType(num: string){
            //Visa
        if(/^4[0-9]{6,}$/.test(num)) return 'Visa';
            //Mastercard
        else if(/^5[1-5][0-9]{5,}$/.test(num)) return 'MasterCard';
            //American Express
        else if(/^3[47][0-9]{5,}$/.test(num)) return 'American Express';
            //Diners Club
        else if(/^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/.test(num)) return 'Diners Club';
            //Discover
        else if(/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(num)) return 'Discover';
            //JCB
        else if(/^(?:2131|1800|35[0-9]{3})[0-9]{3,}$/.test(num)) return 'JBC';
        return 'None';
    };
	/**
	 * Performs the luhn check on the give card number
	 * @param  {string} input Card number
	 * @return {boolean}      Returns the success of passing the luhn check
	 */
    private checkLuhn(input: string){
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
	/**
	 * Removes invalid characters from the given string
	 * @param  {string} str   String to remove characters from
	 * @param  {string} valid String of valid characters
	 * @return {string}       Returns a string with all the invalid characters removed
	 */
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
