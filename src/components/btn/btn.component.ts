import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'btn',
	styles: [ require('./btn.styles.scss'), require('../global-styles/global-styles.scss') ],
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
	private _click = null;
	private _mouseover = null;
	private _mouseout = null;
	private _mouseup = null;
	private _mousedown = null;

	constructor() {
	}

	ngAfterViewChecked() {
		this.loadClasses();
		let btn = this.button.nativeElement;
        this._click = Observable.fromEvent(btn, 'click')
        	.subscribe((event: Event) => {
        		this.clicked();
        	});
        this._mouseover = Observable.fromEvent(btn, 'mouseover')
        	.subscribe((event: Event) => {
				this.swapClass(btn, 'step-one', 'step-two');
				this.swapClass(btn, 'step-two', 'step-three');
        		this.addClass(btn, 'hover');
        	});
        this._mouseout = Observable.fromEvent(btn, 'mouseout')
        	.subscribe((event: Event) => {
				this.swapClass(btn, 'step-three', 'step-two');
				this.swapClass(btn, 'step-two', 'step-one');
        		this.removeClass(btn, 'hover')
        	});
        this._mouseup = Observable.fromEvent(btn, 'mouseup')
        	.subscribe((event: Event) => {
        		let simple = 'font-' + this.color + '-';
        		this.removeClass(btn, 'active');
        		this.swapClass(btn, simple + this.secondary, simple + this.primary);
        	});
        this._mousedown = Observable.fromEvent(btn, 'mouseout')
        	.subscribe((event: Event) => {
        		let simple = 'color font-' + this.color + '-';
        		this.addClass(btn, 'active');
        		this.swapClass(btn, simple + this.primary, simple + this.secondary);
        	});
	}

	ngOnChanges() {
		this.loadClasses();
	}

        // Function to add css classes to the button
	addClass(el, name: string) {
		el.classList.add(name);
	} 

	removeClass(el, name: string) {
		el.classList.remove(name);
	}

	swapClass(el, first: string, second: string) {
		if(el.classList.contains(first)) {
			this.removeClass(el, first);
			this.addClass(el, second);
		}
	}

	loadClasses() {
		let btn = this.button.nativeElement;
		if(!this.disabled && this.btnType !== 'flat') {
			let step = (this.btnType === 'raised' ? 'one' : 'two');
			this.addClass(btn, 'step-' + step);
		} else if(this.disabled) {
			return;
		}
		if(this.btnType !== 'flat' && this.cssClass === '') {
			this.addClass(btn, 'color');
			this.addClass(btn, 'bg-' + this.color + '-' + this.primary);
			this.addClass(btn, 'font-white');
		} else if(this.btnType !== 'flat') { 
			this.addClass(btn, this.cssClass); 
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
