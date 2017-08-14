/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: data-input.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 27/01/2017 5:30 PM
 */

import { Component, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';

@Component({
    selector: 'data-input',
    styleUrls: [ './data-input.styles.css', '../../material-styles/material-styles.css' ],
    templateUrl: './data-input.template.html',
    animations : [
        trigger('fieldText', [
            state('focus',  style({'font-size': '0.6em', 'top': '-0.5em'})),
            state('blur',   style({'font-size': '1.0em', 'top': '0.4em'})),
            transition('blur <=> focus', animate('150ms ease-out')),
        ]),
    ],
})
export class DataInput {
        // Input Variables
    @Input() public type: string = 'text';
    @Input() public name: string = '';
    @Input() public model: string = '';
    @Input() public placeholder: string = '';
    @Input() public format: string = '';
    @Input() public color: string = 'blue';
    @Input() public primary: string = 'C500';
    @Input() public min: number = 0;
    @Input() public max: number = 0;
    @Input() public step: number = 1;
    @Input() public icon: boolean = false;
    @Input() public iconSide: string = 'left';
    @Input() public lockValue: boolean = false;
    @Input() public error: boolean = false;
    @Input() public view: boolean = false;
    @Input() public regex: any = null;
    @Input() public errorMsg: string = 'Input not valid';
    @Input() public infoMsg: string = '';
    @Input() public disabled: boolean = false;
    @Input() public required: boolean = false;
    @Input() public validation: boolean = true;
    @Input() public decimals: boolean = true;
    @Input() public theme: string = 'light';
    @Input() public width: number = null;
    @Input() public readonly: boolean = false;

        // Output Variables
    @Output() public modelChange = new EventEmitter();
    @Output() public errorChange = new EventEmitter();
    @Output() public validate = new EventEmitter();
    @Output() public cardType = new EventEmitter();
    @Output() public onBlur = new EventEmitter();
    @Output() public onFocus = new EventEmitter();

    public display_text: string = '';
    public clean_text: string = '';
    public info_display: string = '';
    public focus: boolean = false;
    public card_type: string = 'None';
    public success: boolean = false;
    public caret: number = 0;
    public no_validate: boolean = false;
    public focus_timer: any = null;
    public validate_timer: any = null;
    public backspace: boolean = false;
    public fresh: boolean = true;
    public _width: number = 12;
    public is_password: boolean = false;
    public is_number: boolean = false;

        // Input Field
    @ViewChild('input') private input: ElementRef;

    private numbers: string = '1234567890';
    private alphabet: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    private alphanumeric: string = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    constructor(private renderer: Renderer) {

    }

    public ngOnInit() {
        this.fresh = true;
    }

    public ngOnChanges(changes: any) {
        setTimeout(() => {
            if (changes.model) {
                this.display_text = this.model;
                // this.validateInput();
            }
            if (changes.type) {
                this.is_password = false;
                this.is_number = false;
                this._width = this.width + (this.icon ? 2 : 0);
                switch (this.type.toLowerCase()) {
                    case 'date':
                        this._width = (this.format ? this.format.length / 2 + 2 : 12) + (this.icon ? 2 : 0);
                        break;
                    case 'number':
                        if (this.width) {
                            this._width = this.width + (this.icon ? 2 : 0);
                        } else {
                            this._width = (
                                this.max && this.max > 0 ?
                                    this.max.toString().length / 2 + 1.5 :
                                    12) + (this.icon ? 2 : 0);
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
                if (this._width > 30) {
                    this._width = 30;
                } else if (this._width < 3) {
                    this._width = 3;
                }
            }
            if (changes.infoMsg) {
                this.info_display = this.infoMsg;
            }
            if (changes.error) {
                if (this.error) {
                    this.info_display = this.errorMsg;
                } else {
                    this.info_display = this.infoMsg;
                }
            }
        });
    }
    /**
     * Focuses on the input field if the field is not disabled or readonly
     * @return {void}
     */
    public focusInput(e: any) {
        if (e && !this.focus) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
        }
        if (this.input && !this.disabled && !this.readonly) {
            this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
            if (this.focus_timer) {
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
    public blurInput() {
        if (!this.focus_timer) {
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
    public keypress(e: any) {
        if (e) {
            if (e.keyCode === '38' && this.type === 'number') { // Up Arrow
                let value = parseInt(this.display_text, 10);
                if (isNaN(value)) {
                    value = this.min ? this.min : 0;
                }
                value += this.step ? this.step : 1;
                if (this.max && value > this.max) {
                    value = this.max;
                }
                this.display_text = value.toString();
            } else if (e.keyCode === '40' && this.type === 'number') { // Down Arrow
                let value = parseInt(this.display_text, 10);
                if (isNaN(value)) {
                    value = typeof this.min === 'number' ? this.min : 0;
                }
                value -= this.step ? this.step : 1;
                if (this.min && value < this.min) {
                    value = this.min;
                }
                this.display_text = (value < 0 ? '-' : '') + value.toString();
            } else if (e.keyCode === '37' || e.keyCode === '39') { // Left & Right Arrow
                this.no_validate = true;
            } else if (e.keyCode === '8') {
                this.backspace = true;
            }
        }
        if (this.validate_timer) {
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
    public checkFocus() {
        return (this.focus || (this.display_text && this.display_text !== '') ? 'focus' : 'blur');
    }
    /**
     * Sets the position of the input cursor/caret inside the field
     * @param  {number} caretPos Index in the text to set the cursor
     * @return {void}
     */
    public setCaretPosition(caretPos: number) {
        if (!this.input) {
            return;
        }
        const elem = this.input.nativeElement;
        if (elem != null) {
            if (elem.createTextRange) {
                const range = elem.createTextRange();
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
    public validateInput() {
        if (this.no_validate) {
            this.no_validate = false;
            return;
        }
            // Reset error display
        this.error = false;
        this.success = false;
        this.info_display = this.infoMsg;
            // Check validity of input
        const valid = true;
        switch (this.type.toLowerCase()) {
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
        if (!this.error && this.required) {
            if (this.clean_text === '') {
                this.error = true;
                this.info_display = this.placeholder + ' is required';
                this.errorChange.emit(true);
            }
        }
        const data = {
            valid,
            data: this.clean_text,
        };
        if (!this.validation) {
            this.error = false;
            this.info_display = this.infoMsg;
        }
        if (this.clean_text && this.clean_text.length > 1) {
            this.fresh = false;
        }
        this.validate.emit(data);
        this.modelChange.emit(this.clean_text);
    }
    /**
     * Validate text field input value
     * @return {string} Returns the valid input value
     */
    private validateText() {
            // Check field validity
        if (this.max && this.max > 0 && this.display_text && this.display_text.length > this.max) {
            this.error = true;
            this.info_display = this.infoMsg;
            this.errorChange.emit(true);
            if (this.lockValue) {
                this.display_text = this.display_text.slice(0, this.max);
            }
        }
        return this.display_text;
    }
    /**
     * Validate an email address input value
     * @return {string} Returns a valid input value
     */
    private validateEmail() {
        if (!this.display_text || this.display_text === '' || this.display_text.length < 5) {
            return '';
        }
        const email = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!email.test(this.display_text)) {
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
    private validatePassword() {
        if (!this.display_text || this.display_text === '' || this.display_text.length < 8) {
            return '';
        }
        let passCheck = this.regex;
        if (!passCheck) {
            passCheck = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,24}$/;
        }
        if (!passCheck.test(this.display_text)) {
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
    private validateDate() {
        return this.display_text;
    }
    /**
     * Validate numerical value
     * @return {void}
     */
    private validateNumber() {
        if (!this.display_text || this.display_text === '') {
            return '';
        }
        const valid_numbers = this.numbers + '.';
        const negative = (this.display_text[0] === '-' ? '-' : '');
        this.display_text = this.removeInvalidChars(this.display_text, this.decimals ? valid_numbers : this.numbers);
        this.display_text = negative + this.display_text;
        const decimal = this.display_text[this.display_text.length - 1] === '.';
        let num: number = +(this.display_text);
        if (isNaN(num)) {
            this.error = true;
            this.info_display = 'Not a valid number';
            this.errorChange.emit(true);
        } else if (this.min && num < this.min) {
            this.error = true;
            this.info_display = 'Too small(<' + this.min + ')';
            this.errorChange.emit(true);
            if (this.lockValue) {
                num = this.min;
            }
        } else if (this.max && num > this.max) {
            this.error = true;
            this.info_display = 'Too big(>' + this.max + ')';
            this.errorChange.emit(true);
            if (this.lockValue) {
                num = this.max;
            }
        }
        this.display_text = (isNaN(num) ? '' : num.toString()) + (decimal ? '.' : '');
        return this.display_text;
    }

    /**
     * Validate Credit/Debit card input value
     * @return {string} Returns a valid input value
     */
    private validateCard() {
        if (!this.display_text || this.display_text === '') {
            return '';
        }
        this.caret = this.input.nativeElement.selectionStart;
        const len = this.display_text.length;
        let num = this.removeInvalidChars(this.display_text, this.numbers);
        if (!num || num === '') {
            this.display_text = '';
            return '';
        }
        if (num.length > 16) {
            num = num.slice(0, 16);
        }
        if (this.checkLuhn(num)) {
            this.card_type = this.getCardType(num);
            this.cardType.emit(this.card_type);
            if (this.card_type !== 'None' && num.length > 12) {
                this.info_display = 'Valid ' + this.card_type;
                this.success = true;
            }
        } else if (num.length > 10) {
            this.error = true;
            this.info_display = 'Invalid Card Number';
            this.errorChange.emit(true);
        }
            // Add seperator
        this.display_text = num.match(/.{1,4}/g).join('-');
        setTimeout(() => {
            const len_new = this.display_text.length;
            let diff = len_new - len;
            const caretDiff = len_new - this.caret;
            const sep_cnt = this.display_text.split('-').length - 1;
            if (caretDiff > 1 && diff !== 0) {
                diff = (((this.caret - sep_cnt) / 4) < sep_cnt) ? 0 : diff;
            } else if (diff === 0 && caretDiff > 1 && (this.caret % 5) === 0 && !this.backspace) {
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
    private getCardType(num: string) {
        if (/^4[0-9]{6,}$/.test(num)) { // Visa
            return 'Visa';
        } else if (/^5[1-5][0-9]{5,}$/.test(num)) {  // Mastercard
            return 'MasterCard';
        } else if (/^3[47][0-9]{5,}$/.test(num)) { // American Express
            return 'American Express';
        } else if (/^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/.test(num)) { // Diners Club
            return 'Diners Club';
        } else if (/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(num)) { // Discover
            return 'Discover';
        } else if (/^(?:2131|1800|35[0-9]{3})[0-9]{3,}$/.test(num)) {  // Discover
            return 'JBC';
        }
        return 'None';
    }
    /**
     * Performs the luhn check on the give card number
     * @param  {string} input Card number
     * @return {boolean}      Returns the success of passing the luhn check
     */
    private checkLuhn(input: string) {
        let sum = 0;
        const numdigits = input.length;
        const parity = numdigits % 2;
        for (let i = 0; i < numdigits; i++) {
            let digit = parseInt(input.charAt(i), 10);
            if (i % 2 === parity) {
                digit *= 2;
            }
            if (digit > 9) {
                digit -= 9;
            }
            sum += digit;
        }
        return (sum % 10) === 0;
    }
    /**
     * Removes invalid characters from the given string
     * @param  {string} str   String to remove characters from
     * @param  {string} valid String of valid characters
     * @return {string}       Returns a string with all the invalid characters removed
     */
    private removeInvalidChars(str: string, valid: string) {
        if (!str) {
            return '';
        }
        let clean_str = '';
        for (let i = 0; i < str.length; i++) {
            if (valid.indexOf(str[i]) >= 0) {
                clean_str += str[i];
            }
        }
        return clean_str;
    }

}
