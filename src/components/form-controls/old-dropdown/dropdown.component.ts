import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: '[old-dropdown]',
  styles: [ require('./dropdown.style.scss') ],
  templateUrl: './dropdown.template.html'
})
export class OldDropdown {
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
    click: any = null;

	constructor() {
        this.click = () => {
            setTimeout(() => {
                this.close();
            }, 20);
        };
	}

  	open() {
      	let now = (new Date()).getTime();
      	if(now - this.last_change < 100) return;
      	if(!this.show) {
  			this.show = true;
            window.addEventListener('click', this.click, true);
            window.addEventListener('touchend', this.click, true);
	    } else this.close();
  	}


  	close() {
    	this.show = false;
        window.removeEventListener('click', this.click, true);
        window.removeEventListener('touchend', this.click, true);
  	}

  	setOption(i: number, e?){
        e.preventDefault();
        e.stopPropagation();
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

}
