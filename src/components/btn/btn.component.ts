import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';

@Component({
	selector: 'btn',
	styles: [ require('./btn.styles.scss'), require('../global-styles/global-styles.scss') ],
	templateUrl: './btn.template.html',
	animations : [
        trigger('clickResp', [
            //state('hide',   style({'transform':'translate(-50%, -50%) scale(0)', opacity: 0})),
            transition('* => *', animate('0.5s ease-out', keyframes([
            	style({'transform':'translate(-50%, -50%) scale(0)', opacity: 0.5, offset: 0}),
                style({'transform':'translate(-50%, -50%) scale(1)', opacity: 0, offset: 1.0})
            ])))
        ])
    ]
})
export class Button {
	@Input() cssClass: string = '';
	@Input() color: string = 'blue';
	@Input() primary: string = 'C500';
	@Input() secondary: string = 'C600';
	@Input() type: string = '';
	@Input() btnType: string = 'flat';
	@Input() disabled: boolean = false;
	@Output() onClick = new EventEmitter();

	click_state: string = 'show';
	classes: string = '';
	timeout: any = null;

	constructor() {
	}

	ngOnInit() {
		this.loadClasses();
	}

	ngOnChanges() {
		this.loadClasses();
	}

	loadClasses() {
		if(!this.disabled) this.classes = (this.btnType === 'raised' ? 'step-one ' : (this.btnType.indexOf('action') >= 0 ? 'step-two ' : ''));
		else this.classes = '';
		if(this.btnType !== 'flat' && this.cssClass === '') this.classes += 'color bg-' + this.color + '-' + this.primary + ' font-white';
		else if(this.btnType !== 'flat') this.classes += ' ' + this.cssClass;
		else if(this.btnType === 'flat') this.classes += ' color font-' + this.color + '-' + this.primary;
	}

	addHover() {
		if(this.disabled) return;
		this.classes += ' hover';
		if(this.btnType === 'raised' || this.btnType.indexOf('action') >= 0) this.classes = this.classes.replace(this.primary, this.secondary);
	}

	removeHover() {
		if(this.disabled) return;
		this.classes = this.classes.replace(' hover', '');
		if(this.btnType === 'raised' || this.btnType.indexOf('action') >= 0) this.classes = this.classes.replace(this.secondary, this.primary);
	}

	addActive() {
		if(this.disabled) return;
		this.classes += ' active';
		if(this.btnType === 'raised' || this.btnType.indexOf('action') >= 0) this.classes = this.classes.replace('step-one', 'step-two');
		if(this.btnType === 'raised' || this.btnType.indexOf('action') >= 0) this.classes = this.classes.replace('C600', 'C500');
	}

	removeActive() {
		if(this.disabled) return;
		this.classes = this.classes.replace(' active', '');
		if(this.btnType === 'raised' || this.btnType.indexOf('action') >= 0) this.classes = this.classes.replace('two', 'one');
	}

	clicked() {
		if(this.disabled) return;
		this.click_state = (this.click_state === 'show' ? 'hide' : 'show');
		this.onClick.emit();
	}

}
