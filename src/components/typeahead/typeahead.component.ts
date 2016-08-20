import { Injectable, ComponentResolver, ComponentRef, ReflectiveInjector, ViewContainerRef, ResolvedReflectiveProvider, Type } from '@angular/core';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'typeahead-list',
    template: `
		<div #contents class="contents">
			<div #list class="options" [style.display]="filtered_list.length > 0 ? 'inherit' : 'none'">
				<ul #listView>
					<li [class]="'option ' + cssClass" 
						*ngFor="let item of filtered_list; let i = index" 
						[class.first]="i==0" 
						[class.last]="i==filtered_list.length - 1"  
						[class.other]="i > 0" 
						[class.odd]="i%2===1" 
						[class.even]="i%2===0" 
						(click)="setItem(i)"
						(touchend)="setItem(i)">

						<div class="name">{{item.name}}</div>
						<div class="desc">{{item.description}}</div>
					</li>
				</ul>
			</div>
		</div>
    `,
    styles : [ require('./typeahead-list.styles.scss') ]
})
class TypeaheadList {
	app : any = null;
	parent: any = null;
	items: any[] = []; 
	filtered_list: any[] = [];
	results: number = 5;
	cssClass: string = 'default';
  	contents_box: any = null;
  	last_change: number = 0;
  	scrolled: boolean = false;
  	timer: any = null;
  	filter: string = '';
  	filterFields: string[] = [];

	@ViewChild('list') list : ElementRef;
	@ViewChild('contents') contents : ElementRef;
	@ViewChild('listView') list_contents : ElementRef;

  	keys = {37: 1, 38: 1, 39: 1, 40: 1};

  	ngOnInit() {
  		setTimeout(() => {
	    	this.app = document.getElementById('app');
		    this.list_contents.nativeElement.onscroll = () => { 
		    	this.scrolled = true;
    			if(this.timer !== null) clearTimeout(this.timer);
    			this.timer = setTimeout(() => {
          			this.scrolled = false;
    			}, 1000);
    		}
    		this.list.nativeElement.onmousedown = () => {
    			this.parent.clicked = true;
    		}
    		document.onmouseup = (event) => {
    			setTimeout(() => {
    				this.parent.clicked = false;
    			}, 200)
    		}
	      	this.disableScroll();
	    }, 100);
  	}

  	setupList(ta: any, items: any[], filterFields: string[], filter: string, num_results: number = 5, cssClass: string = 'default') {
  		this.parent = ta;
  		this.items = items;
  		this.filter = filter;
  		this.filterFields = filterFields;
  		this.results = num_results;
  		this.cssClass = cssClass;
  		this.filterList();
  	}

  	updateFilter(filter: string) {
  		this.filter = filter;
  		this.filterList();
  	}

  	filterList() {
  		let added = 0;
  		if(!this.filter || this.filter === '') {
  			this.filtered_list = JSON.parse(JSON.stringify(this.items.length > this.results ? this.items.slice(0, this.results) : this.items));
  			return;
  		}
  		this.filtered_list = [];
  		let filter = this.filter.toLowerCase();
  		for(let i = 0; i < this.items.length; i++) {
  			let item = this.items[i];
  			if(typeof item !== 'object') continue;
  			if(this.filterFields.length > 0) {
  				for(let k = 0; k < this.filterFields.length; k++) {
  					let f = this.filterFields[k];
  					if(item[f] && typeof item[f] === 'string') {
  						let data = item[f].toLowerCase();
  						if(data.indexOf(filter) >= 0) {
	  						this.filtered_list.push(JSON.parse(JSON.stringify(item)));
	  						added++;
	  						break;
	  					}
  					}
  				}
  			} else {
  				let keys = Object.keys(item);
  				for(let k = 0; k < keys.length; k++) {
  					let f = keys[k];
  					console.log(k, typeof item[f]);
  					if(item[f] && typeof item[f] === 'string') {
  						let data = item[f].toLowerCase();
  						console.log(filter, '|', data, '|', data.indexOf(filter));
  						if(data.indexOf(filter) >= 0) {
	  						this.filtered_list.push(JSON.parse(JSON.stringify(item)));
	  						added++;
	  						break;
	  					}
  					}
  				}
  			}
  			if(added >= this.results) break;
  		}
  	}

	preventDefault(e) {
  		e = e || window.event;
  		if (e.preventDefault)
      		e.preventDefault();
  		e.returnValue = false;  
	}

	preventDefaultForScrollKeys(e) {
		if(!this.keys) return;
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
  		this.positionList();
  	}

  	positionList() {
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
  		} else {
  			setTimeout(() => {
  				this.positionList();
  			})
  		}
  	}

  	clicked() {
  		this.parent.clicked = true;
  	}

  	setItem(i: number){
  		if(this.scrolled) return;
    	this.parent.setItem(this.filtered_list[i]);
    	this.parent.clicked = false;
  	}

  	ngOnDestroy() {
    	document.onclick = null;
    	document.ontouchend = null;
  		this.enableScroll();
  	}

}


@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: '[typeahead]',  // <home></home>
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
  styles: [ require('./typeahead.style.scss') ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './typeahead.template.html'
})
export class Typeahead {
  	@Input() filter: string = '';
  	@Input() filterFields: string[] = [];
  	@Input() list: any[] = [];
  	@Input() results: number = 5;
  	@Input() active: boolean = false;
  	@Input() cssClass: string = 'default';
  	@Output() onSelect = new EventEmitter();

  	@ViewChild('main') main: ElementRef;

  	show: boolean = false;
  	list_view: any = null;
  	list_ref: any = null;
  	last_change: number = null;
  	container: any;
  	id: number = 12345678;
  	closing: boolean = false;
  	clicked: boolean = false;

	constructor(private _cr: ComponentResolver, private view: ViewContainerRef) {

	}

	ngOnChanges(changes: any) {
		if(changes.filter) {
			if(this.list_view) this.list_view.updateFilter(this.filter);
		}
		if(changes.active && !this.clicked) {
			setTimeout(() => {
				if(!this.active) this.close();
				else this.open();
			}, 200);
		} else if(changes.active) {
			setTimeout(() => {
				this.ngOnChanges(changes);
			}, 200);
		}
	}

  	open() {
  		if(this.list_ref) return;
      	let now = (new Date()).getTime();
      	if(now - this.last_change < 100) return;
      	if(!this.show) {
      		this.render(TypeaheadList);
  			this.show = true;
	    } else { 
	    	this.close();
	    }
  	}


  	close() {
  		if(!this.list_ref) return;
  		this.closing = true;
    	this.show = false;
    	if(this.list_ref) {
    		if(this.list_ref.location.nativeElement.parent)
		    	this.list_ref.location.nativeElement.parent.removeChild(this.list_ref.location.nativeElement);
		    this.list_ref.destroy();
		    this.list_ref = null;
		}
		this.clicked = false;
  	}

  	setItem(item: any){
    	this.onSelect.emit(item);
    	this.close();
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
	            	this.list_view = cmpRef.instance;
	            	this.list_ref = cmpRef;
	            	this.list_view.setupList(this, this.list, this.filterFields, this.filter, this.results, this.cssClass)
	            	this.list_view.moveList(this.main);
	            	return this.list;
	            });
        }
    }
}
