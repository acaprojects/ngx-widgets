import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { Observable } from 'rxjs/Rx';

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
	@Input() disabled: boolean = false;
		// Output emitters
	@Output() onClick = new EventEmitter();
		// Template Elements
	@ViewChild('btnContainer') container: ElementRef;
	@ViewChild('btn') button: ElementRef;

	click_state: string = 'show';

		//Private event observers
	private _click: any = null;
	private _mouseover: any = null;
	private _mouseout: any = null;
	private _mouseup: any = null;
	private _mousedown: any = null;

	constructor() {
	}

	ngAfterViewChecked() {
		this.loadClasses();
		if(this.cssClass) {
			let classes = this.cssClass.split(' ');
			let btn = this.button.nativeElement;
			for(let i = 0; i < classes.length; i++) {
				this.addClass(btn, classes[i]);
			}
		}
	}

	addHover() {
		let btn = this.button.nativeElement;
		this.swapClass(btn, 'step-one', 'step-two');
		this.swapClass(btn, 'step-two', 'step-three');
		this.addClass(btn, 'hover');
	}

	removeHover() {
		let btn = this.button.nativeElement;
		this.swapClass(btn, 'step-three', 'step-two');
		this.swapClass(btn, 'step-two', 'step-one');
		this.removeClass(btn, 'hover')
	}

	addActive() {
		let btn = this.button.nativeElement;
		let simple = 'font-' + this.color + '-';
		this.addClass(btn, 'active');
		this.swapClass(btn, simple + this.primary, simple + this.secondary);
	}

	removeActive() {
		let btn = this.button.nativeElement;
		let simple = 'font-' + this.color + '-';
		this.removeClass(btn, 'active');
		this.swapClass(btn, simple + this.secondary, simple + this.primary);
	}

	ngOnChanges(changes: any) {
		this.loadClasses();
	}

        // Function to add css classes to the button
	addClass(el: any, name: string) {
		el.classList.add(name);
	}

	removeClass(el: any, name: string) {
		el.classList.remove(name);
	}

	swapClass(el: any, first: string, second: string) {
		if(el.classList.contains(first)) {
			this.removeClass(el, first);
			this.addClass(el, second);
		}
	}

	loadClasses() {
		let btn = this.button.nativeElement;
		if(!this.disabled && this.btnType !== 'flat') {
			let step = (this.btnType.indexOf('raised') >= 0 ? 'one' : 'two');
			this.addClass(btn, 'step-' + step);
		} else if(this.disabled) {
			return;
		}
		if(this.btnType !== 'flat' && this.cssClass === '') {
			this.addClass(btn, 'color');
			this.addClass(btn, 'bg-' + this.color + '-' + this.primary);
			this.addClass(btn, 'font-white');
		} else if(this.btnType !== 'flat') {
		} else if(this.btnType === 'flat') {
			this.addClass(btn, 'color');
			this.addClass(btn, 'font-' + this.color + '-' + this.primary);
		}
	}

	clicked() {
		if(this.disabled) return;
		this.click_state = (this.click_state === 'show' ? 'hide' : 'show');
		this.onClick.emit();
	}

}
