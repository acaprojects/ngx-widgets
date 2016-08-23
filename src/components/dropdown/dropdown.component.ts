import { Injectable, ComponentResolver, ComponentRef, ReflectiveInjector, ViewContainerRef, ResolvedReflectiveProvider, Type } from '@angular/core';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';


@Component({
    selector: 'dropdown-list',
    template: `
		<div #contents class="contents">
			<div #list class="options">
				<ul #listView>
					<li [class]="'option ' + cssClass" 
						*ngFor="let item of options; let i = index" 
						[class.first]="i==0" 
						[class.last]="i==options.length-1"  
						[class.other]="i > 0" 
						[class.odd]="i%2===1" 
						[class.even]="i%2===0" 
						(click)="setOption(i)"
						(touchend)="setOption(i)">
							<div class="check">{{selected === i ? '&#x2713;' : ''}}</div>{{item}} 
					</li>
				</ul>
			</div>
		</div>
    `,
    styles : [ require('./dropdown-list.styles.scss') ]
})
class DropdownList {
	app : any = null;
	dropdown: any = null;
	options: string[] = ['----']; 
	selected: number = 0;
	cssClass: string = 'default';
  	contents_box: any = null;
  	last_change: number = 0;
  	scrolled: boolean = false;
  	timer: any = null;

	@ViewChild('list') list : ElementRef;
	@ViewChild('contents') contents : ElementRef;
	@ViewChild('listView') list_contents : ElementRef;

  	keys = {37: 1, 38: 1, 39: 1, 40: 1};

  	ngOnInit() {
  		setTimeout(() => {
	    	this.app = document.getElementById('app');
	      	let clk_fn = (event) => {
	      		if(!this.scrolled){
		         	let center = {
		              	x: event.clientX,
		              	y: event.clientY
		          	}
		          	if(this.checkClick(center)) setTimeout(() => { this.dropdown.close(); }, 10);
	      		}
	      		this.scrolled = false;
	      	};
		    if(this.app) {
		      	this.app.onclick = clk_fn;
		      	document.ontouchend = clk_fn;
		    } else {
		    	document.onclick = clk_fn;
		      	document.ontouchend = clk_fn;
		    }
		    this.list_contents.nativeElement.onscroll = () => { 
		    	this.scrolled = true;
    			if(this.timer !== null) clearTimeout(this.timer);
    			this.timer = setTimeout(() => {
          			this.scrolled = false;
    			}, 1000);
    		}
	      	this.disableScroll();
	    }, 100);
  	}

  	setupList(dd: any, options: string[], selected: number) {
  		this.dropdown = dd;
  		this.options = options;
  		this.selected = selected;
  	}

  	checkClick(c) {
      	if(c.x < this.contents_box.left || c.y < this.contents_box.top || 
         	c.x > this.contents_box.left + this.contents_box.width || 
          	c.y > this.contents_box.top + this.contents_box.height) {
          	return true;
      	}
      	return false;
  	}

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
		if(!this.app) return;
  		if (this.app.addEventListener) // older FF
      		this.app.addEventListener('DOMMouseScroll', this.preventDefault, false);
  		this.app.onwheel = this.preventDefault; // modern standard
  		this.app.onmousewheel = this.app.onmousewheel = this.preventDefault; // older browsers, IE
  		this.app.ontouchmove  = this.preventDefault; // mobile
  		this.app.onkeydown  = this.preventDefaultForScrollKeys;
	}

	enableScroll() {
		if(!this.app) return;
    	if (this.app.removeEventListener)
        	this.app.removeEventListener('DOMMouseScroll', this.preventDefault, false);
    	this.app.onmousewheel = this.app.onmousewheel = null; 
    	this.app.onwheel = null; 
    	this.app.ontouchmove = null;  
    	this.app.onkeydown = null;  
	}

  	moveList(main: any, event?: any) {
  		if(!main || !this.contents) return;
  		let main_box = main.nativeElement.getBoundingClientRect();
  		this.contents.nativeElement.style.width = '1px';
  		this.contents.nativeElement.style.top = Math.round(main_box.top) + 'px';
  		this.contents.nativeElement.style.left = Math.round(main_box.left + main_box.width/2) + 'px';
  		this.contents.nativeElement.style.height = Math.round(main_box.height) + 'px';
  		this.contents.nativeElement.style.display = '';
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
	      	this.contents_box = this.contents.nativeElement.getBoundingClientRect();
  		}
  	}

  	setOption(i: number){
  		if(this.scrolled) return;
    	this.last_change = (new Date()).getTime();
    	this.selected = i;
    	this.dropdown.setOption(i);
  	}

  	ngOnDestroy() {
	    if(this.app) {
	      	this.app.onclick = null;
	      	this.app.ontouchend = null;
	    } else {
	    	document.onclick = null;
	    	document.ontouchend = null;
	    }
  		this.enableScroll();
  	}

}


@Component({
  selector: '[dropdown]', 
  styles: [ require('./dropdown.style.scss') ],
  templateUrl: './dropdown.template.html'
})
export class Dropdown {
  	@Input() options: string[] = ['Select an Option'];
  	@Input() selected: number = 0;
  	@Input() cssClass: string = 'default';
  	@Input() selectClass: string = 'default';
  	@Output() selectedChange = new EventEmitter();

  	@ViewChild('main') main: ElementRef;

  	show: boolean = false;
  	list: any = null;
  	list_ref: any = null;
  	last_change: number = null;
  	container: any;
  	id: number = 12345678;

	constructor(private _cr: ComponentResolver, private view: ViewContainerRef) {

	}

  	open() {
      	let now = (new Date()).getTime();
      	if(now - this.last_change < 100) return;
      	if(!this.show) {
      		this.render(DropdownList);
  			this.show = true;
	    } else this.close();
  	}


  	close() {
    	this.show = false;
    	if(this.list_ref) {
    		if(this.list_ref.location.nativeElement.parent)
		    	this.list_ref.location.nativeElement.parent.removeChild(this.list_ref.location.nativeElement);
		    this.list_ref.destroy();
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

  	ngOnDestroy() {
  		this.close();
  	}

    private render(type: Type, bindings: ResolvedReflectiveProvider[] = []){
    	if(this.view) {
	        return this._cr.resolveComponent(type)
	            .then(cmpFactory => {
	                const ctxInjector = this.view.parentInjector;
	                const childInjector = Array.isArray(bindings) && bindings.length > 0 ?
	                    ReflectiveInjector.fromResolvedProviders(bindings, ctxInjector) : ctxInjector;
	                return this.view.createComponent(cmpFactory, this.view.length, childInjector);
	            })
	            .then((cmpRef: ComponentRef<any>) => {
	                document.body.appendChild(cmpRef.location.nativeElement);
	            	this.list = cmpRef.instance;
	            	this.list_ref = cmpRef;
	            	this.list.setupList(this, this.options, this.selected)
	            	this.list.moveList(this.main);
	            	return this.list;
	            });
        }
    }
}
