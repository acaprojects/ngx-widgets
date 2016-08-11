import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';


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
  	@Output() onSelect = new EventEmitter();

	@ViewChild('list') list_el: ElementRef;
	@ViewChild('main') main: ElementRef;
	@ViewChild('contents') contents: ElementRef;

  	filtered_list: any[] = [];
  	list_box: any = null;
 	show: boolean = false;

  	constructor(private cd: ChangeDetectorRef) {

  	}

  	ngOnInit() {
  	}

  	ngOnViewInit() {
  	}

  	ngOnChanges(changes: any) {
  		if(changes.filter) {
  			this.filterList();
  			this.open();
  		}
  		if(changes.list) {
  			this.filterList();
  			this.open();
  		}
  		if(changes.active) {
  			if(this.active) {
	  			this.filterList();
  				this.open();
	  		} else {
	  			setTimeout(() => { this.close(); }, 100);
	  		}
  		}
  	}

  	filterList() {
  		let added = 0;
  		this.filtered_list = [];
  		if(this.filter === '') {
  			this.filtered_list = this.list.length > this.results ? this.list.splice(0, this.results) : this.list;
  			return;
  		}
  		for(let i = 0; i < this.list.length; i++) {
  			let item = this.list[i];
  			if(typeof item !== 'object') continue;
  			if(this.filterFields.length > 0) {
  				for(let k = 0; k < this.filterFields.length; k++) {
  					let f = this.filterFields[k];
  					if(item[f] && typeof item[f] === 'string' && item[f].toLowerCase().indexOf(this.filter.toLowerCase()) >= 0) {
  						this.filtered_list.push(item);
  						added++;
  						break;
  					}
  				}
  			} else {
  				let keys = Object.keys(item);
  				for(let k = 0; k < keys.length; k++) {
  					let f = keys[k];
  					if(item[f] && typeof item[f] === 'string' && item[f].toLowerCase().indexOf(this.filter.toLowerCase()) >= 0) {
  						this.filtered_list.push(item);
  						added++;
  						break;
  					}
  				}
  			}
  			if(added > this.results) break;
  		}
  	}


  	open() {
      	let now = (new Date()).getTime();
	    this.moveContainer(null);
      	this.show = true;
      	setTimeout(() => {
	      	if(this.list_el) {
	      		this.setListPosition();
		    } else {
		    	this.show = false;
		    }
      	}, 100);
  	}

  	setListPosition() {
		window.addEventListener('scroll', (event) => { this.moveContainer(event) }, true);
	    this.moveContainer(null);
  	}

  	moveContainer(event: any) {
  		if(!this.main || !this.contents) return;
  		let main_box = this.main.nativeElement.getBoundingClientRect();
  		this.contents.nativeElement.style.top = Math.round(main_box.top) + 'px';
  		this.contents.nativeElement.style.left = Math.round(main_box.left + main_box.width/2) + 'px';
  		this.contents.nativeElement.style.height = Math.round(main_box.height) + 'px';
  		if(this.list_el) {
	  		let h = document.documentElement.clientHeight;
	      	let content_box = this.contents.nativeElement.getBoundingClientRect();
	      	if(Math.round(content_box.top) > Math.round(h/2 + 10)) {
	      		this.list_el.nativeElement.style.top = '';
	      		this.list_el.nativeElement.style.bottom = '100%';
	      	} else {
	      		this.list_el.nativeElement.style.top = '100%';
	      		this.list_el.nativeElement.style.bottom = '';
	      	}
	      	this.list_box = this.list_el.nativeElement.getBoundingClientRect();
  		}
  	}

	close() {
  		this.show = false;
  	}

  	select(i: any){
  		let item = this.list[i];
  		console.log(item);
  		this.onSelect.emit(item);
  		this.close();
  	}

}
