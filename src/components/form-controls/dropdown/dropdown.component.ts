/**
 * @Author: Alex Sorafumo
 * @Date:   20/09/2016 1:54 PM
 * @Email:  alex@yuion.net
 * @Filename: dropdown.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 20/12/2016 9:37 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';

@Component({
    selector: 'dropdown',
    styleUrls: [ './dropdown.style.css' ],
    templateUrl: './dropdown.template.html',
})
export class Dropdown {
    @Input() public items: any[] = [];
    @Input() public model: any = null;
    @Input() public index: number = 0;
    @Input() public fields: string[] = ['name'];
    @Input() public cssClass: string = 'default';
    @Input() public placeholder: string = '';

    @Output() public modelChange: any = new EventEmitter();
    @Output() public indexChange: any = new EventEmitter();

    public display_items: any = [];
    public current_item: any = null;
    public shown: boolean = true;
    private type: string = 'string';

    @ViewChild('list') private list: ElementRef;

    public ngOnChanges(changes: any) {
        if (changes.items) {
            this.shown = false;
            if (this.items && this.items.length > 0) {
                setTimeout(() => {
                    this.display_items = this.items;
                    this.type = typeof this.items[0];
                    if (!this.placeholder || this.placeholder === '') {
                        if (!this.model) {
                            this.model = this.items[0];
                        }
                    }
                }, 200);
            }
        }
        if (changes.model) {
            setTimeout(() => {
                this.current_item = this.model;
            }, 200);
        }
    }
    /**
     * Selects the item with the given index
     * @param {number} i Index of the selected item
     * @return {void}
     */
    public select(i: number) {
        this.model = this.display_items[i];
        this.modelChange.emit(this.model);
        this.indexChange.emit(i);
        this.shown = false;
    }

    public toggle() {
        this.shown = !this.shown;
    }

    public checkTap(e: any) {
        console.log('Check tap');
        if (e) {
            const bb = this.list.nativeElement.getBoundingClientRect();
            const c = e.center;
            if (c.x < bb.left || c.x > bb.left + bb.width || c.y < bb.top || c.y > bb.top + bb.height) {
                this.shown = false;
            }
        }
    }
    /**
     * Checks whether the given item contains a property containing the given string
     * @param {any}    item   Item to search through
     * @param {string} search String to search for within item
     * @return {boolean} Returns whether or not the string is contained in the item
     */
    private itemContains(item: any, search: string) {
        const s = search.toLowerCase();
        for (const p in item) {
            if (typeof item[p] === 'string' && item[p].toLowerCase().indexOf(s) >= 0) {
                return true;
            } else if (typeof item[p] === 'number' && item[p].toString().indexOf(s) >= 0) {
                return true;
            } else if (typeof item[p] === 'object' && this.itemContains(item[p], search)) {
                return true;
            }
        }
        return false;
    }

}
