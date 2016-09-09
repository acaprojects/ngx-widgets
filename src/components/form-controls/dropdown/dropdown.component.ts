import { Injectable } from '@angular/core';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'dropdown', 
  styles: [ require('./dropdown.style.scss'), require('../../global-styles/global-styles.scss') ],
  templateUrl: './dropdown.template.html'
})
export class Dropdown {
	@Input() type: string = 'generic';
  	@Input() options: string[] = ['Select an Option'];
  	@Input() selected: string = '0';
  	@Input() disabled: boolean = false;
  	@Input() color: string = 'grey';
  	@Input() primary: string = 'C500';
  	@Input() secondary: string = 'C600';
  	@Output() selectedChange = new EventEmitter();

  	@ViewChild('main') 	  main: 	ElementRef;
  	@ViewChild('box') 	  box: 		ElementRef;
  	@ViewChild('text') 	  text: 	ElementRef;
  	@ViewChild('caret')   caret: 	ElementRef;
  	@ViewChild('content') content: 	ElementRef;
  	@ViewChild('listView') list_view: 	ElementRef;

  	private _text_mouseout = null;
  	private _text_mouseover = null;
  	private _text_mouseup = null;
  	private _text_mousedown = null;
  	private _text_click = null;

  	private _caret_mouseout = null;
  	private _caret_mouseover = null;
  	private _caret_mouseup = null;
  	private _caret_mousedown = null;
  	private _caret_click = null;

  	prev_sel: string = '0'
  	value: string = '0';
  	show: boolean = false;
  	list: any = null;
  	list_ref: any = null;
  	last_change: number = null;
  	container: any;
  	id: number = 12345678;
  	classes: string = '';
  	top: boolean = false;
  	parseInt = parseInt;
  	click = null;
  	text_hover = false;

	constructor() {
		this.click = () => { 
			setTimeout(() => {
				this.close();
			}, 10);
		};
	}

	ngOnInit() {
    	this.value = this.options[parseInt(this.selected) === NaN ? 0 : parseInt(this.selected)];
    	this.prev_sel = this.selected;
	}

	ngAfterViewChecked() {
		this.loadClasses();
		let txt = this.text.nativeElement;
		this._text_click = Observable.fromEvent(txt, 'click')
			.subscribe((event: Event) => {
				this.open();
			})
		this._text_mouseover = Observable.fromEvent(txt, 'mouseover')
			.subscribe((event: Event) => {
				this.removeClass(txt, 'hover');
			})
		this._text_mouseout = Observable.fromEvent(txt, 'mouseout')
			.subscribe((event: Event) => {
				this.removeClass(txt, 'hover');
			})
		this._text_mousedown = Observable.fromEvent(txt, 'mousedown')
			.subscribe((event: Event) => {
				this.addClass(txt, 'active');
				this.addClass(txt, 'aca-step-one');
			})
		this._text_mouseup = Observable.fromEvent(txt, 'mouseup')
			.subscribe((event: Event) => {
				this.removeClass(txt, 'active');
				this.removeClass(txt, 'aca-step-one');
			})
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
		if(!this.list_view || !this.box) return;
		let list = this.list_view.nativeElement;
		let box = this.box.nativeElement;
		this.addClass(list, this.type + ' ' + (this.top ? 'top' : 'bottom'));
		this.addClass(box,  this.type + ' ' + (this.top ? 'top' : 'bottom'));
		//this.classes += ' color bg-' + this.color + '-' + this.primary + ' font-white';
	}

	removeHover() {
		if(this.disabled) return;
		this.classes = this.classes.replace(' hover', '');
	}

	addActive() {
		if(this.disabled) return;
		console.log('Add Active');
		if(this.classes.indexOf(' active aca-step-one') < 0)
			this.classes += ' active aca-step-one';
	}

	removeActive() {
		if(this.disabled) return;
		this.classes = this.classes.replace(' active aca-step-one', '');
	}

  	open(force: boolean = false) {
  		if(this.type === 'segmented' && !force) {
  			this.close();
  			return;
  		}
      	let now = (new Date()).getTime();
      	if(now - this.last_change < 100) return;
      	if(!this.show) {
      		//this.classes += ''
  			this.show = true;
			setTimeout(() => {
				document.addEventListener("click", this.click, true);
			}, 100);
	    } else this.close();
  	}


  	close() {
		this.removeHover(); 
		this.removeActive(); 
    	this.show = false;
		document.removeEventListener("click", this.click, true);
  	}

  	updateInput() {
    	this.last_change = (new Date()).getTime();
    	this.selectedChange.emit(this.value);
  	}

  	finishedInput() {
  		if(!this.value || this.value === '') {
  			this.setOption({}, parseInt(this.prev_sel) === NaN ? 0 : parseInt(this.prev_sel) );
  		} else this.selectedChange.emit(this.value);
  		setTimeout(() => {
  			this.close();
  		}, 100);
  	}

  	setOption(event: any, i: number){
  		if (event.stopPropagation) event.stopPropagation();
		else event.cancelBubble = true;
		event.preventDefault();
  		setTimeout(() => {
	    	this.last_change = (new Date()).getTime();
	    	this.selected = i.toString();
	    	this.prev_sel = this.selected;
	    	this.value = this.options[i];
	    	this.selectedChange.emit(i.toString());
	    	this.close();
  		}, 100)
  	}

  	get option(){
    	return this.options[this.selected];
  	}

  	ngOnDestroy() {
  		this.close();
  	}
}
