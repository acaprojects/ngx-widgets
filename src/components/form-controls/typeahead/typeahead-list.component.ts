/*
* @Author: Alex Sorafumo
* @Date:   2017-05-07 11:57:15
* @Last Modified by:   Alex Sorafumo
* @Last Modified time: 2017-05-07 12:01:30
*/

import { ComponentRef, Injectable, ReflectiveInjector, ResolvedReflectiveProvider, Type } from '@angular/core';
import { ComponentFactoryResolver, Renderer, ViewContainerRef } from '@angular/core';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'typeahead-list',
    templateUrl: './typeahead-list.template.html',
    styleUrls : [ './typeahead-list.styles.css' ],
})
export class TypeaheadList {
    public app: any = null;
    public parent: any = null;
    public items: any[] = [];
    public filtered_list: any[] = [];
    public results: number = 5;
    public cssClass: string = 'default';
    public none_msg: string = '';
    public auto: boolean = false;
    public force_top: boolean = false;

    public keys = {37: 1, 38: 1, 39: 1, 40: 1};

    private contents_box: any = null;
    private last_change: number = 0;
    private timer: any = null;
    private filter: string = '';
    private filterFields: string[] = [];
    private scroll: any = null;
    private mousedown: any = null;
    private mouseup: any = null;

    @ViewChild('list') private list: ElementRef;
    @ViewChild('contents') private contents: ElementRef;
    @ViewChild('listView') private list_contents: ElementRef;

    constructor(private renderer: Renderer) {
    }
    /**
     * Sets the values for the typeahead list
     * @param  {any}        ta           Parent directive
     * @param  {any[]}      items        Typeahead list items
     * @param  {string[]}   filterFields Item fields to filter on
     * @param  {string}     filter       Text to search fields for
     * @param  {number}     num_results  Maximum number of results display
     * @param  {string}     cssClass     CSS Class to add to typeahead list
     * @param  {boolean = false} auto      Automatically position typeahead
     * @param  {boolean = false} force_top Force typeahead above element
     * @return {void}
     */
    public setupList(
            ta: any, items: any[], filterFields: string[], filter: string, num_results: number,
            cssClass: string, auto: boolean = false, force_top: boolean = false,
        ) {

        this.parent = ta;
        this.items = items;
        this.filter = filter;
        this.filterFields = filterFields;
        this.results = num_results ? num_results : 5;
        this.cssClass = cssClass ? cssClass : 'default';
        this.auto = auto;
        this.force_top = force_top;
        this.filterList();
    }
    /**
     * Updates the display position of the list on the view
     * @param  {any}    main  ElementRef that the typeahead is attached to
     * @param  {any}    event (Optional) Event
     * @return {void}
     */
    public moveList(main: any, event?: any) {
        if (!main || !this.contents) {
            return;
        }
        const main_box = main.nativeElement.getBoundingClientRect();
        const c_el = this.contents.nativeElement;
        this.renderer.setElementStyle(c_el, 'width', '1px');
        this.renderer.setElementStyle(c_el, 'top', Math.round(main_box.top + window.pageYOffset) + 'px');
        this.renderer.setElementStyle(c_el, 'left', Math.round(main_box.left + main_box.width / 2) + 'px');
        this.renderer.setElementStyle(c_el, 'height', Math.round(main_box.height) + 'px');
        this.renderer.setElementStyle(c_el, 'display', '');
        this.positionList();
    }
    /**
     * Notifies the parent component that it has been clicked/tapped
     * @return {void}
     */
    public clicked() {
        this.parent.clicked = true;
    }
    /**
     * Notifies the parent component of the selected element
     * @param {any}    e Input event
     * @param {number} i Index of the selected item
     */
    public setItem(e: any, i: number) {
        if (e) { // Prevent clicking through typeahead
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
        }
        this.clicked();
        setTimeout(() => {
            this.parent.setItem(this.filtered_list[i]);
            this.parent.clicked = false;
        }, 30);
    }
    /**
     * Update the filtering on the item list
     * @param  {string} filter Text to filter on
     * @return {void}
     */
    private updateFilter(filter: string) {
        this.filter = filter;
        this.filterList();
    }
    /**
     * Filter list of items. If no filter set return all items up to results limit
     * @return {void}
     */
    private filterList() {
        let added = 0;
        if (!this.filter || this.filter === '') {
            const items = this.items.length > this.results ? this.items.slice(0, this.results) : this.items;
            this.filtered_list = JSON.parse(JSON.stringify(items));
            return;
        }
        this.filtered_list = [];
        const filter = this.filter.toLowerCase();
        for (const item of this.items) {
            if (typeof item !== 'object') {
                continue;
            }
            const keys = this.filterFields.length > 0 ? this.filterFields : Object.keys(item);
            for (const f of keys) {
                if (item[f] && typeof item[f] === 'string') {
                    const data = item[f].toLowerCase();
                    if (data.indexOf(filter) >= 0) {
                        let found = false;
                        for (const f_item of this.filtered_list) {
                            if (item && item.id === f_item.id) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            this.filtered_list.push(JSON.parse(JSON.stringify(item)));
                            added++;
                        }
                        break;
                    }
                }
            }
            if (added >= this.results) {
                break;
            }
        }
    }
    /**
     * Sets the relative position of the typeahead
     * @param  {number} tries Retry counter
     * @return {void}
     */
    private positionList(tries?: number) {
        if (!tries) {
            tries = 0;
        }
        if (this.list && this.contents) {
            const h = document.documentElement.clientHeight;
            const content_box = this.contents.nativeElement.getBoundingClientRect();
            if (this.auto && tries % 4 === 0) {
                const l_el = this.list_contents.nativeElement;
                if (Math.round(content_box.top) > Math.round(h / 2 + 10) || this.force_top) {
                    this.renderer.setElementStyle(l_el, 'top', '');
                    this.renderer.setElementStyle(l_el, 'bottom', '2.0em');
                } else {
                    this.renderer.setElementStyle(l_el, 'top', '0');
                    this.renderer.setElementStyle(l_el, 'bottom', '');
                }
            }
            this.contents_box = this.contents.nativeElement.getBoundingClientRect();
        } else {
            setTimeout(() => {
                this.positionList(tries + 1);
            }, 200);
        }
    }

}
