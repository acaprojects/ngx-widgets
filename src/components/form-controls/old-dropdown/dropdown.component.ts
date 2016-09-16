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
    @ViewChild('contents') contents: ElementRef;

  	show: boolean = false;
  	list: any = null;
  	list_ref: any = null;
  	last_change: number = null;
  	container: any;
  	id: number = 12345678;
    click: any = null;
    moved: any = null;
    released: any = null;
    move: boolean = false;
    down: boolean = false;


	constructor() {
        this.click = (e) => {
            this.down = true;
            setTimeout(() => {
                if(this.contents) {
                    console.log(e);
                    let bb = this.contents.nativeElement.getBoundingClientRect();
                    let pos = {
                        x: (e instanceof TouchEvent ? e.changedTouches.clientX : e.clientX),
                        y: (e instanceof TouchEvent ? e.changedTouches.clientY : e.clientY)
                    }
                    if(pos.x < bb.left || pos.x > bb.left + bb.width || pos.y < bb.top || pos.y > bb.top + bb.height) {
                        this.close();
                    }
                } else this.close();
            }, 20);
        };
        this.moved = () => {
            this.move = true;
        }
        this.released = (e) => {
            setTimeout(() => {
                this.down = false;
                this.move = false;
            }, 20);
        }
	}

  	open() {
      	let now = (new Date()).getTime();
      	if(now - this.last_change < 100) return;
      	if(!this.show) {
  			this.show = true;
            window.addEventListener('mousedown', this.click, true);
            window.addEventListener('touchstart', this.click, true);
            window.addEventListener('mousemove', this.moved, true);
            window.addEventListener('touchmove', this.moved, true);
            window.addEventListener('mouseup', this.released, true);
            window.addEventListener('touchend', this.released, true);
	    } else this.close();
  	}


  	close() {
    	this.show = false;
        window.removeEventListener('mousedown', this.click, true);
        window.removeEventListener('touchstart', this.click, true);
        window.removeEventListener('mousemove', this.moved, true);
        window.removeEventListener('touchmove', this.moved, true);
        window.removeEventListener('mouseup', this.released, true);
        window.removeEventListener('touchend', this.released, true);
  	}

  	setOption(i: number, e?){
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if(this.move) {
            this.move = false;
            return;
        }
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
