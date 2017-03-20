/**
* @Author: Alex Sorafumo
* @Date:   20/09/2016 1:54 PM
* @Email:  alex@yuion.net
* @Filename: dropdown.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 20/12/2016 9:37 AM
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';

@Component({
    selector: 'dropdown',
    styleUrls: [ './dropdown.style.css' ],
    templateUrl: './dropdown.template.html',
	animations : [
        trigger('show', [
            state('show',  style({ opacity: '1' })),
            state('hide',  style({ opacity: '0' })),
            transition('* <=> *', animate('150ms ease-out'))
        ]),
        trigger('showlist', [
            state('show',  style({ opacity: '1', height: '*' })),
            state('hide',  style({ opacity: '0', height: '2.0em', display: 'none' })),
            transition('* <=> *', animate('750ms ease-out'))
        ])
    ]
})
export class Dropdown {
	@Input() items: any[] = [];
	@Input() model: any = null;
	@Input() index: number = 0;
	@Input() fields: string[] = ['name'];
	@Input() cssClass: string = 'default';

	@Output() modelChange: any = new EventEmitter();
	@Output() indexChange: any = new EventEmitter();

	@ViewChild('list') list: ElementRef;

	type: string = 'string';
	display_items: any = [];
	shown: boolean = false;

	constructor() {

	}

	ngOnInit() {
	}

	ngOnDestroy() {

	}

	ngOnChanges(changes: any) {
		if(changes.items) {
			if(this.items && this.items.length > 0) {
				this.display_items = this.items;
				this.type = typeof this.items[0];
				if(!this.model) {
					this.model = this.items[0];
				}
			}
		}
	}
	/**
	 * Checks whether the given item contains a property containing the given string
	 * @param {any}    item   Item to search through
	 * @param {string} search String to search for within item
	 * @return {boolean} Returns whether or not the string is contained in the item
	 */
	itemContains(item: any, search: string) {
		let s = search.toLowerCase();
		for(let p in item){
			if(typeof item[p] === 'string' && item[p].toLowerCase().indexOf(s) >= 0) {
				return true;
			} else if(typeof item[p] === 'number' && item[p].toString().indexOf(s) >= 0) {
				return true;
			} else if(typeof item[p] === 'object' && this.itemContains(item[p], search)) {
				return true;
			}
		}
		return false;
	}
	/**
	 * Selects the item with the given index
	 * @param {number} i Index of the selected item
	 * @return {void}
	 */
	select(i: number) {
		this.model = this.display_items[i];
		this.modelChange.emit(this.model);
		this.indexChange.emit(i);
		this.shown = false;
	}

	toggle() {
		this.shown = !this.shown;
	}

	checkTap(e: any) {
		if(e) {
			let bb = this.list.nativeElement.getBoundingClientRect();
			let c = e.center;
			if(c.x < bb.left || c.x > bb.left + bb.width || c.y < bb.top || c.y > bb.top + bb.height) {
				this.shown = false;
			}
		}
	}

}
