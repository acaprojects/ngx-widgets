/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   15/09/2016 12:32 PM
* @Email:  alex@yuion.net
* @Filename: btn.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 07/02/2017 11:51 AM
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Utility } from '../../../helpers/utility.class';

@Component({
	selector: 'btn-toggle',
	styleUrls: [ './btn-toggle.styles.css', '../../material-styles/material-styles.css' ],
	templateUrl: './btn-toggle.template.html',
	animations : [
        trigger('clickResp', [
            //state('hide',   style({'transform':'translate(-50%, -50%) scale(0)', opacity: 0})),
            transition('void => *', animate('50ms ease-out')),
            transition('* => *', animate('0.5s ease-out', keyframes([
            	style({'transform':'translate(-50%, -50%) scale(0)', opacity: 0.5, offset: 0}),
                style({'transform':'translate(-50%, -50%) scale(1)', opacity: 0, offset: 1.0})
            ])))
        ])
    ]
})
export class ButtonToggle {
		// Component Inputs
	@Input() model: boolean = false;
	@Input() cssClass: string = '';
	@Input() color: string = 'blue';
	@Input() primary: string = 'C500';
	@Input() secondary: string = 'C600';
	@Input() styles: any = {};
	@Input() disabled: boolean = false;
		//
	@Output() modelChange = new EventEmitter();
		// Template Elements
	@ViewChild('btnContainer') container: ElementRef;
	@ViewChild('btn') button: ElementRef;

	btnType: string = 'raised';
	click_state: string = 'show';
	action_btn: boolean = false;
	last_styles: string = '';

	constructor() {
	}

	ngAfterViewInit() {
		this.loadClasses();
		if(this.cssClass) {
			let classes = this.cssClass.split(' ');
			let btn = this.button.nativeElement;
			for(let i = 0; i < classes.length; i++) {
				Utility.addClass(btn, classes[i]);
			}
		}
	}
	/**
	 * Add hover CSS classes to button
	 * @return {void}
	 */
	addHover() {
		let btn = this.button.nativeElement;
		Utility.swapClass(btn, 'step-one', 'step-two');
		Utility.swapClass(btn, 'step-two', 'step-three');
		Utility.addClass(btn, 'hover');
	}

	/**
	 * Remove hover CSS classes to button
	 * @return {void}
	 */
	removeHover() {
		let btn = this.button.nativeElement;
		Utility.swapClass(btn, 'step-three', 'step-two');
		Utility.swapClass(btn, 'step-two', 'step-one');
		Utility.removeClass(btn, 'hover')
	}

	/**
	 * Add active CSS classes to button
	 * @return {void}
	 */
	addActive() {
		let btn = this.button.nativeElement;
		let simple = 'font-' + this.color + '-';
		Utility.addClass(btn, 'active');
		Utility.swapClass(btn, simple + this.primary, simple + this.secondary);
	}

	/**
	 * Remove active CSS classes to button
	 * @return {void}
	 */
	removeActive() {
		let btn = this.button.nativeElement;
		let simple = 'font-' + this.color + '-';
		Utility.removeClass(btn, 'active');
		Utility.swapClass(btn, simple + this.secondary, simple + this.primary);
	}

	ngOnChanges(changes: any) {
		if(changes.color || changes.primary || changes.secondary || changes.btnType){
			this.loadClasses();
			this.action_btn = this.btnType ? this.btnType.indexOf('action') >= 0 : false;
		}
		if(changes.model) {
			this.updateClass();
		}
	}

	ngDoCheck() {
		let s = JSON.stringify(this.styles);
		if(this.button && this.styles && this.last_styles !== s) {
			this.last_styles = s;
			for(let p in this.styles) {
				let name: any = p.split('-');
				name.forEach((str, index) => { if(index > 0) str[0] = str[0].toUpperCase(); })
				name = name.join('');
				let style = this.button.nativeElement.style;
				if(name in style) {
					this.button.nativeElement.style[name] = this.styles[name];
				}
			}
		}
	}

	/**
	 * Add initial classes for the button
	 * @return {void}
	 */
	private loadClasses() {
		let btn = this.button.nativeElement;
		btn.className = 'aca';
		if(!this.disabled && this.btnType !== 'flat') {
			let step = (this.btnType.indexOf('raised') >= 0 ? 'one' : 'two');
			Utility.addClass(btn, 'step-' + step);
		} else if(this.disabled) {
			return;
		}
		if(this.btnType !== 'flat' && this.cssClass === '') {
			Utility.addClass(btn, 'color');
			Utility.addClass(btn, 'bg-' + this.color + '-' + this.primary);
			Utility.addClass(btn, 'font-white');
		}
		if(this.model) {
			Utility.removeClass(btn, 'is-off');
			Utility.addClass(btn, 'is-on');
		} else {
			Utility.removeClass(btn, 'is-on');
			Utility.addClass(btn, 'is-off');
		}
	}

	/**
	 * Called when the button is clicked
	 * @return {void}
	 */
	clicked() {
		if(this.disabled) return;
		this.click_state = (this.click_state === 'show' ? 'hide' : 'show');
		this.model = !this.model;
		this.updateClass();
		this.modelChange.emit(this.model);
	}

	updateClass() {
		let btn = this.button.nativeElement;
		if(this.model) {
			Utility.removeClass(btn, 'is-off');
			Utility.addClass(btn, 'is-on');
		} else {
			Utility.removeClass(btn, 'is-on');
			Utility.addClass(btn, 'is-off');
		}
	}

}
