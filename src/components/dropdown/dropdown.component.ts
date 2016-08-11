import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';


@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: '[dropdown]',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
  ],
  // We need to tell Angular's compiler which directives are in our template.
  // Doing so will allow Angular to attach our behavior to an element
  directives: [
  ],
  // We need to tell Angular's compiler which custom pipes are in our template.
  pipes: [ ],
  // Our list of styles in our component. We may add more to compose many styles together
  styles: [ require('./dropdown.style.scss') ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './dropdown.template.html'
})
export class Dropdown {
  @Input() options: string[] = ['Select an Option'];
  @Input() selected: number = 0;
  @Input() cssClass: string = 'default';
  @Input() selectClass: string = 'default';
  @Output() selectedChange = new EventEmitter();

  @ViewChild('list') list: ElementRef;
  @ViewChild('main') main: ElementRef;
  @ViewChild('contents') contents: ElementRef;

  	show: boolean = false;
  	list_box: any = null;
  	last_change: number = 0;

	constructor(private cd: ChangeDetectorRef) {
	}

	ngOnInit() {

	}

	ngOnViewInit() {
	}

  	ngOnChanges(changes: any) {
  	}

  	open() {
      	let now = (new Date()).getTime();
	    this.moveContainer(null);
      	if(now - this.last_change < 100) return;
      	this.show = true;
      	setTimeout(() => {
	      	if(this.list) {
	      		this.setListPosition();
		    } else {
		    	this.show = false;
		    }
      	}, 100);
  	}

  	setListPosition() {
      	let fn = (event) => {
         	let center = {
              	x: event.clientX,
              	y: event.clientY
          	}
          	this.checkClick(center);
      	};
      	document.getElementById('app').onclick = fn;
      	document.getElementById('app').ontouchend = fn;
		window.addEventListener('scroll', (event) => { this.moveContainer(event) }, true);
	    this.moveContainer(null);
  	}

  	moveContainer(event: any) {
  		if(!this.main || !this.contents) return;
  		let main_box = this.main.nativeElement.getBoundingClientRect();
  		this.contents.nativeElement.style.top = Math.round(main_box.top) + 'px';
  		this.contents.nativeElement.style.left = Math.round(main_box.left + main_box.width/2) + 'px';
  		this.contents.nativeElement.style.height = Math.round(main_box.height) + 'px';
  		if(this.list) {
	  		let h = document.documentElement.clientHeight;
	      	let content_box = this.contents.nativeElement.getBoundingClientRect();
	      	if(Math.round(content_box.top) > Math.round(h/2 + 10)) {
	      		this.list.nativeElement.style.top = '';
	      		this.list.nativeElement.style.bottom = '100%';
	      	} else {
	      		this.list.nativeElement.style.top = '100%';
	      		this.list.nativeElement.style.bottom = '';
	      	}
	      	this.list_box = this.list.nativeElement.getBoundingClientRect();
  		}
  	}

  	keys = {37: 1, 38: 1, 39: 1, 40: 1};

	preventDefault(e) {
  		e = e || window.event;
  		if (e.preventDefault)
      		e.preventDefault();
  		e.returnValue = false;  
	}

	preventDefaultForScrollKeys(e) {
    	if (this.keys[e.keyCode]) {
        	this.preventDefault(e);
        	return false;
    	}
	}

	disableScroll() {
  		if (window.addEventListener) // older FF
      		window.addEventListener('DOMMouseScroll', this.preventDefault, false);
  		window.onwheel = this.preventDefault; // modern standard
  		window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
  		window.ontouchmove  = this.preventDefault; // mobile
  		document.onkeydown  = this.preventDefaultForScrollKeys;
	}

	enableScroll() {
    	if (window.removeEventListener)
        	window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
    	window.onmousewheel = document.onmousewheel = null; 
    	window.onwheel = null; 
    	window.ontouchmove = null;  
    	document.onkeydown = null;  
	}

  	close() {
    	this.show = false;
    	document.getElementById('app').onclick = null;
    	document.getElementById('app').ontouchend = null;
		window.removeEventListener('scroll', () => { }, true);
  	}

  	checkClick(c) {
      	if(c.x < this.list_box.left || c.y < this.list_box.top || 
         	c.x > this.list_box.left + this.list_box.width || 
          	c.y > this.list_box.top + this.list_box.height) {
          	setTimeout(() => { this.close(); }, 10);
      	}
  	}

  	setOption(i: number){
    	this.last_change = (new Date()).getTime();
    	this.selected = i;
    	this.selectedChange.emit(i);
    	this.close();
  	}

  	get option(){
    	return this.options[this.selected];
  	}
}
