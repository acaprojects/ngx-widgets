/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   20/09/2016 1:44 PM
 * @Email:  alex@yuion.net
 * @Filename: typeahead.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 30/01/2017 5:19 PM
 */

import { ComponentRef, Injectable, ReflectiveInjector, ResolvedReflectiveProvider, Type } from '@angular/core';
import { ComponentFactoryResolver, Renderer, ViewContainerRef } from '@angular/core';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'typeahead-list',
    template: `
    <div #contents class="contents">
    <div #list class="options">
    <ul #listView>
    <li [class]="'option ' + cssClass"
    *ngFor="let item of filtered_list; let i = index"
    [class.first]="i==0"
    [class.last]="i==filtered_list.length - 1"
    [class.other]="i > 0"
    [class.odd]="i%2===1"
    [class.even]="i%2===0"
    (tap)="setItem($event, i)">

    <div class="name">{{item.name}}</div>
    <div class="desc">{{item.description}}</div>
    </li>
    <li class="option" *ngIf="filtered_list.length <= 0">{{ none_msg && none_msg !== '' ? none_msg : 'No results'}}</li>
    </ul>
    </div>
    </div>
    `,
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

@Component({
    selector: '[typeahead]',
    styleUrls: [ './typeahead.style.css' ],
    templateUrl: './typeahead.template.html',
})
export class Typeahead {
    @Input() public filter: string = '';
    @Input() public filterFields: string[] = [];
    @Input() public list: any[] = [];
    @Input() public results: number = 5;
    @Input() public show: boolean = false;
    @Input() public auto: boolean = false;
    @Input() public forceTop: boolean = false;
    @Input() public cssClass: string = 'default';
    @Input() public msg: string = '';
    @Output() public selected = new EventEmitter();

    public shown: boolean = false;
    public closing: boolean = false;

    @ViewChild('main') private main: ElementRef;

    private list_view: any = null;
    private list_ref: any = null;
    private last_change: number = null;
    private container: any;
    private id: number = 12345678;
    private clicked: boolean = false;
    private update_timer: any = null;

    constructor(private _cr: ComponentFactoryResolver, private view: ViewContainerRef, private renderer: Renderer) {

    }

    public ngOnChanges(changes: any) {
        if (changes.filter) {
            if (this.list_view) {
                this.list_view.updateFilter(this.filter);
            }
        }
        if (changes.show && !this.clicked) {
            setTimeout(() => {
                if (!this.show) {
                    this.close();
                } else {
                    this.open();
                }
            }, 200);
        } else if (changes.show) {
            setTimeout(() => {
                this.ngOnChanges(changes);
            }, 200);
        }
        if (changes.list) {
            setTimeout(() => {
                if (this.list_view) {
                    this.list_view.setupList(this, this.list, this.filterFields, this.filter, this.results, this.cssClass, this.auto, this.forceTop);
                }
            }, 200);
        }
    }
    /**
     * Opens the typeahead option list
     * @return {void}
     */
    public open() {
        if (this.list_ref) {
            return;
        }
        const now = (new Date()).getTime();
        if (now - this.last_change < 100) {
            return;
        }
        if (!this.shown) {
            this.render();
            this.shown = true;
        } else {
            this.close();
        }
    }
    /**
     * Close the typeahead option list
     * @return {void}
     */
    public close() {
        if (!this.list_ref) {
            return;
        }
        this.closing = true;
        this.shown = false;
        if (this.list_ref) {
            if (this.list_ref.location.nativeElement.parent) {
                this.list_ref.location.nativeElement.parent.removeChild(this.list_ref.location.nativeElement);
            }
            this.list_ref.destroy();
            this.list_ref = null;
        }
        this.clicked = false;
        if (this.update_timer) {
            clearInterval(this.update_timer);
            this.update_timer = null;
        }
    }
    /**
     * Sets the selected item and emits it to the binding
     * @param {any} item [description]
     */
    public setItem(item: any) {
        this.selected.emit(item);
        this.close();
    }

    public ngOnDestroy() {
        this.close();
    }
    /**
     * Creates the option list and attaches it to the DOM
     * @return {void}
     */
    private render() {
        if (this.view) {
            const factory = this._cr.resolveComponentFactory(TypeaheadList);
            const cmpRef = this.view.createComponent(factory);
            document.body.appendChild(cmpRef.location.nativeElement);
            this.list_view = cmpRef.instance;
            this.list_ref = cmpRef;
            this.list_view.setupList(this, this.list, this.filterFields, this.filter, this.results, this.cssClass, this.auto, this.forceTop);
            this.list_view.moveList(this.main);

            this.update_timer = setInterval(() => {
                this.list_view.moveList(this.main);
            }, 50);
            this.list_view.none_msg = this.msg;
            return this.list;
        }
    }
}
