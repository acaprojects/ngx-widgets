import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: '[old-dropdown]',
  styleUrls: [ './dropdown.style.css' ],
  templateUrl: './dropdown.template.html'
})
export class OldDropdown {
  	@Input() options: string[] = ['Select an Option'];
  	@Input() selected: number = 0;
  	@Input() cssClass: string = 'default';
  	@Input() selectClass: string = 'default';
  	@Output() selectedChange = new EventEmitter();

    @ViewChild('main') main: ElementRef;
    @ViewChild('listview') contents: ElementRef;

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
    last_pos: any = null;

	constructor() {
        this.click = (e: any) => {
            this.down = true;
        };
        this.moved = (e: any) => {
            if(this.down){
                let pos = {
                    x: (e instanceof TouchEvent ? e.changedTouches[0].clientX : e.clientX),
                    y: (e instanceof TouchEvent ? e.changedTouches[0].clientY : e.clientY)
                }
                if(this.last_pos && (Math.abs(this.last_pos.x - pos.x) > 5 || Math.abs(this.last_pos.y - pos.y) > 5) ) {
                    this.move = true;
                }
                this.last_pos = pos;
            }
        }
        this.released = (e: any) => {
            setTimeout(() => {
                if(!this.move) {
                    if(this.contents) {
                        let bb = this.contents.nativeElement.getBoundingClientRect();
                        let pos = {
                            x: (e instanceof TouchEvent ? e.changedTouches[0].clientX : e.clientX),
                            y: (e instanceof TouchEvent ? e.changedTouches[0].clientY : e.clientY)
                        }
                        if(pos.x < bb.left || pos.x > bb.left + bb.width || pos.y < bb.top || pos.y > bb.top + bb.height) {
                            this.close();
                        }
                    } else this.close();
                }
                this.last_pos = null;
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
            document.addEventListener('mousedown', this.click, true);
            document.addEventListener('touchstart', this.click, true);
            document.addEventListener('mousemove', this.moved, true);
            document.addEventListener('touchmove', this.moved, true);
            document.addEventListener('mouseup', this.released, true);
            document.addEventListener('touchend', this.released, true);
	    } else this.close();
  	}


  	close() {
        setTimeout(() => {
        	this.show = false;
            document.removeEventListener('mousedown', this.click, true);
            document.removeEventListener('touchstart', this.click, true);
            document.removeEventListener('mousemove', this.moved, true);
            document.removeEventListener('touchmove', this.moved, true);
            document.removeEventListener('mouseup', this.released, true);
            document.removeEventListener('touchend', this.released, true);
        }, 20)
  	}

  	setOption(i: number, e?: any){
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if(this.move) {
            setTimeout(() => {
                this.move = false;
            }, 20)
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
