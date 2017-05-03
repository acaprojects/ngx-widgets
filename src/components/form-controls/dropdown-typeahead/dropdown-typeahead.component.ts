/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: dropdown.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:29 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
      selector: 'dropdown-typeahead',
      styleUrls: [ './dropdown-typeahead.style.css', '../../material-styles/material-styles.css' ],
      templateUrl: './dropdown-typeahead.template.html',
    animations : [
        trigger('show', [
            state('show',  style({ opacity: '1' })),
            state('hide',  style({ opacity: '0' })),
            transition('show <=> hide', animate('150ms ease-out')),
        ]),
        trigger('showlist', [
            state('show',  style({ opacity: '1', height: '*' })),
            state('hide',  style({ opacity: '0', height: '2.0em', display: 'none' })),
            transition('show <=> hide', animate('750ms ease-out')),
        ]),
    ],
})
export class DropdownTypeahead {
    @Input() public items: any[] = [];
    @Input() public model: any = null;
    @Input() public index: number = 0;
    @Input() public search: string = '';
    @Input() public fields: string[] = ['name'];
    @Input() public cssClass: string = 'default';
    @Input() public placeholder: string = '';

    @Output() public modelChange: any = new EventEmitter();
    @Output() public indexChange: any = new EventEmitter();
    @Output() public searchChange: any = new EventEmitter();

    public display_items: any = [];
    public current_item: any = null;
    public shown: boolean = false;

    @ViewChild('list') private list: ElementRef;

    private type: string = 'string';

    public ngOnInit() {
        this.filter();
    }

    public ngOnChanges(changes: any) {
        if (changes.items) {
            if (this.items && this.items.length > 0) {
                setTimeout(() => {
                    this.type = typeof this.items[0];
                    this.display_items = this.items;
                    if (!this.placeholder || this.placeholder === '') {
                        if (!this.model) {
                            this.model = this.items[0];
                        }
                    }
                    this.filter();
                }, 200);
            }
        }
        if (changes.model || changes.search) {
            this.filter();
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
        this.search = '';
        this.shown = false;
    }

    public toggle() {
        this.shown = !this.shown;
        this.search = '';
        this.filter();
    }

    public checkTap(e: any) {
        if (e) {
            const bb = this.list.nativeElement.getBoundingClientRect();
            const c = e.center;
            if (c.x < bb.left || c.x > bb.left + bb.width || c.y < bb.top || c.y > bb.top + bb.height) {
                this.shown = false;
                this.search = '';
                setTimeout(() => {
                    this.filter();
                }, 500);
            }
        }
    }
    /**
     * Filters the items to be displayed based off the search string
     */
    private filter() {
        this.searchChange.emit(this.search);
        let filtered: any[] = [];
        const items = JSON.parse(JSON.stringify(this.items));
        if (!this.search || this.search === '') {
            filtered = items;
            const i = filtered.indexOf(this.model);
            if (i >= 0) {
                filtered.splice(i, 1);
            }
        } else {
            for (const i of items) {
                if (i !== this.model) {
                    if (this.type === 'object' && this.itemContains(i, this.search)) {
                        filtered.push(i);
                    } else if (this.itemContains({ id: i }, this.search)) {
                        filtered.push(i);
                    }
                }
            }
        }
        this.display_items = filtered;
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
