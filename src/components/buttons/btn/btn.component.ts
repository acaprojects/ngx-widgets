/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   15/09/2016 12:32 PM
* @Email:  alex@yuion.net
* @Filename: btn.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 07/02/2017 11:51 AM
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Utility } from '../../../helpers/utility.class';

@Component({
	selector: 'btn',
	styleUrls: [ './btn.styles.css', '../../material-styles/material-styles.css' ],
	templateUrl: './btn.template.html',
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
export class Button {
		// Component Inputs
	@Input() cssClass: string = '';
	@Input() color: string = 'blue';
	@Input() primary: string = 'C500';
	@Input() secondary: string = 'C600';
	@Input() type: string = '';
	@Input() btnType: string = 'flat';
	@Input() styles: any = {};
	@Input() disabled: boolean = false;
		// Output emitters
	@Output() tapped = new EventEmitter();
		// Template Elements
	@ViewChild('btnContainer') container: ElementRef;
	@ViewChild('btn') button: ElementRef;

	click_state: string = 'show';
	action_btn: boolean = false;
	last_styles: string = '';
	hover: boolean = false;
	active: boolean = false;
	base_class: string = 'aca btn';
	btn_class: string = 'aca btn';

	constructor(private renderer: Renderer) {
	}

	ngAfterViewInit() {
		this.base_class = `aca btn ${this.cssClass}`;
		this.updateClasses();
	}

	updateClasses() {
		setTimeout(() => {
			if(this.cssClass && this.cssClass !== ''){
				let el_class = `${this.base_class}`;
			} else {
				let el_class_c_p = `color bg-${this.color}-${this.primary} font-white`;
				let el_class_c_s = `color bg-${this.color}-${this.secondary} font-white`;
				let el_class_step = this.btnType === 'flat' ? `` : `step-${this.active?'two':'one'}`;
				let el_class_color = this.hover ? el_class_c_s : el_class_c_p ;
				this.btn_class = `${this.base_class} ${this.disabled ? '' : el_class_color} ${el_class_step}`;
			}
		}, 20);
	}
	/**
	 * Sets the hover state of the button
	 * @return {void}
	 */
	setHover(state: boolean = false) {
		this.hover = state;
		this.updateClasses();
	}

	/**
	 * Sets the hover state of the button
	 * @return {void}
	 */
	setActive(state: boolean = false) {
		this.active = state;
		this.updateClasses();
	}

	ngOnChanges(changes: any) {
		if(changes.color || changes.primary || changes.secondary || changes.btnType || changes.disabled){
			this.action_btn = this.btnType ? this.btnType.indexOf('action') >= 0 : false;
			this.updateClasses();
		}
		if(changes.cssClass) {
			this.base_class = `aca btn ${this.cssClass}`;
			this.updateClasses();
		}
	}

	ngDoCheck() {
		let s = JSON.stringify(this.styles);
		if(this.button && this.styles && this.last_styles !== s) {
			let btn = this.button.nativeElement;
			this.last_styles = s;
			for(let p in this.styles) {
				let name: any = p.split('-');
				name.forEach((str, index) => { if(index > 0) str[0] = str[0].toUpperCase(); })
				name = name.join('');
				let style = this.button.nativeElement.style;
				if(name in style) {
					this.renderer.setElementStyle(btn, name, this.styles[name]);
				}
			}
		}
	}

	/**
	 * Called when the button is clicked
	 * @return {void}
	 */
	clicked() {
		if(this.disabled) return;
		this.click_state = (this.click_state === 'show' ? 'hide' : 'show');
		this.tapped.emit();
	}

}
