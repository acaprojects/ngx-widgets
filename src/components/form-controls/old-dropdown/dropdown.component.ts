/**
* @Author: Alex Sorafumo
* @Date:   20/09/2016 1:54 PM
* @Email:  alex@yuion.net
* @Filename: dropdown.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 20/12/2016 9:37 AM
*/

import { Injectable, ComponentFactoryResolver, ViewContainerRef, Type } from '@angular/core';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'old-dropdown-list',
    styleUrls: [ './dropdown-list.style.css' ],
    templateUrl: './dropdown.template.html'
})
export class OldDropdownList {
    @Input() options: string[] = ['Select an Option'];
    @Input() selected: number = 0;
    @Input() cssClass: string = 'default';

    parent: any = null;

    @ViewChild('contents') contents: ElementRef;

    setup(params: any) {
        let keys = Object.keys(params);
        for(let i = 0; i < keys.length; i++){
            if(keys[i] in this) {
                this[keys[i]] = params[keys[i]];
            }
        }
    }

    checkClick(e:any) {
        if(e) {
            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault();
            setTimeout(() => {
                let bb = this.contents.nativeElement.getBoundingClientRect();
                let c = e.center;
                if(c.x < bb.left || c.x > bb.left + bb.width || c.y < bb.top || c.y  > bb.top + bb.height) {
                    this.parent.close();
                }
            }, 50);
        }
    }

    select(i: number, e?:any) {
        if(e) {
            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault();
        }
        setTimeout(() => {
            this.selected = i;
            this.parent.setOption(i);
        }, 50);
    }

    moveList(main: any, event?: any) {
        if(!main || !this.contents) return;
        let main_box = main.nativeElement.getBoundingClientRect();
        this.contents.nativeElement.style.width = '1px';
        this.contents.nativeElement.style.top = Math.round(main_box.top + window.pageYOffset) + 'px';
        this.contents.nativeElement.style.left = Math.round(main_box.left + main_box.width/2) + 'px';
        this.contents.nativeElement.style.height = Math.round(main_box.height) + 'px';
        this.contents.nativeElement.style.display = '';
    }

}

@Component({
  selector: 'old-dropdown',
  styleUrls: [ './dropdown.style.css' ],
  template: `
    <div #main [class]="'aca dropdown ' + cssClass" (click)="open()">
        <div class="text">{{options[selected] ? options[selected] : '-----'}}</div>
        <div class="text placeholder" *ngFor="let o of options">{{o}}</div>
    </div>
  `
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
    update_timer: any = null;
    last_change: number = (new Date()).getTime();

	constructor(private view: ViewContainerRef, private _cfr: ComponentFactoryResolver) {
	}

  	open() {
        let now = (new Date()).getTime();
        if(now - 1000 > this.last_change){
            this.render(OldDropdownList);
        }
  	}


  	close() {
        if(this.list_ref) {
            if(this.update_timer) {
                clearInterval(this.update_timer);
            }
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

    private render(type: Type<any>){
        if(this.view) {
        	if(this.list_ref) {
        		this.list_ref.destroy();
        	}
        	let factory = this._cfr.resolveComponentFactory(type);
        	let cmpRef = this.view.createComponent(factory);
            document.body.appendChild(cmpRef.location.nativeElement);
            this.list = cmpRef.instance;
            this.list_ref = cmpRef;

            this.list.setup({
                parent: this,
                options: this.options,
                selected: this.selected,
                cssClass: this.selectClass
            });
            this.list.moveList(this.main);
            this.update_timer = setInterval(() => {
                this.list.moveList(this.main);
            }, 50);
            return this.list;
        }
    }

}
