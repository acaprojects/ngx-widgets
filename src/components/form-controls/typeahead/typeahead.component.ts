/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   20/09/2016 1:44 PM
* @Email:  alex@yuion.net
* @Filename: typeahead.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 30/01/2017 5:19 PM
*/

import { Injectable, ComponentFactoryResolver, ComponentRef, ReflectiveInjector, ViewContainerRef, ResolvedReflectiveProvider, Type } from '@angular/core';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

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
    styleUrls : [ './typeahead-list.styles.css' ]
})
export class TypeaheadList {
    app : any = null;
    parent: any = null;
    items: any[] = [];
    filtered_list: any[] = [];
    results: number = 5;
    cssClass: string = 'default';
    contents_box: any = null;
    last_change: number = 0;
    timer: any = null;
    filter: string = '';
    filterFields: string[] = [];
    scroll: any = null;
    mousedown: any = null;
    mouseup: any = null;
    none_msg: string = '';
    auto: boolean = false;
    force_top: boolean = false;

    @ViewChild('list') list : ElementRef;
    @ViewChild('contents') contents : ElementRef;
    @ViewChild('listView') list_contents : ElementRef;

    keys = {37: 1, 38: 1, 39: 1, 40: 1};

    constructor() {
    }

    ngOnInit() {
        setTimeout(() => {
        }, 100);
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
    setupList(ta: any, items: any[], filterFields: string[], filter: string, num_results: number, cssClass: string, auto: boolean = false, force_top: boolean = false) {
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
     * Update the filtering on the item list
     * @param  {string} filter Text to filter on
     * @return {void}
     */
    updateFilter(filter: string) {
        this.filter = filter;
        this.filterList();
    }
    /**
     * Filter list of items. If no filter set return all items up to results limit
     * @return {void}
     */
    filterList() {
        let added = 0;
        if(!this.filter || this.filter === '') {
            this.filtered_list = JSON.parse(JSON.stringify(this.items.length > this.results ? this.items.slice(0, this.results) : this.items));
            return;
        }
        this.filtered_list = [];
        let filter = this.filter.toLowerCase();
        for(let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            if(typeof item !== 'object') continue;
            let keys = this.filterFields.length > 0 ? this.filterFields : Object.keys(item);
            for(let k = 0; k < keys.length; k++) {
                let f = keys[k];
                if(item[f] && typeof item[f] === 'string') {
                    let data = item[f].toLowerCase();
                    if(data.indexOf(filter) >= 0) {
                        let found = false;
                        for(let i = 0; i < this.filtered_list.length; i++){
                            if(item && item.id === this.filtered_list[i].id) {
                                found = true;
                                break;
                            }
                        }
                        if(!found){
                            this.filtered_list.push(JSON.parse(JSON.stringify(item)));
                            added++;
                        }
                        break;
                    }
                }
            }
            if(added >= this.results) break;
        }
    }
    /**
     * Updates the display position of the list on the view
     * @param  {any}    main  ElementRef that the typeahead is attached to
     * @param  {any}    event (Optional) Event
     * @return {void}
     */
    moveList(main: any, event?: any) {
        if(!main || !this.contents) return;
        let main_box = main.nativeElement.getBoundingClientRect();
        this.contents.nativeElement.style.width = '1px';
        this.contents.nativeElement.style.top = Math.round(main_box.top + window.pageYOffset) + 'px';
        this.contents.nativeElement.style.left = Math.round(main_box.left + main_box.width/2) + 'px';
        this.contents.nativeElement.style.height = Math.round(main_box.height) + 'px';
        this.contents.nativeElement.style.display = '';
        this.positionList();
    }
    /**
     * Sets the relative position of the typeahead
     * @param  {number} tries Retry counter
     * @return {void}
     */
    positionList(tries?: number) {
        if(!tries) tries = 0;
        if(this.list && this.contents) {
            let h = document.documentElement.clientHeight;
            let content_box = this.contents.nativeElement.getBoundingClientRect();
            if(this.auto && tries % 4 === 0){
                if(Math.round(content_box.top) > Math.round(h/2 + 10) || this.force_top) {
                    console.log('Auto Top');
                    this.list_contents.nativeElement.style.top = '';
                    this.list_contents.nativeElement.style.bottom = '2.0em';
                } else {
                    console.log('Auto Bottom');
                    this.list_contents.nativeElement.style.top = '0';
                    this.list_contents.nativeElement.style.bottom = '';
                }
            }
            this.contents_box = this.contents.nativeElement.getBoundingClientRect();
        } else {
            setTimeout(() => {
                this.positionList(tries+1);
            }, 200);
        }
    }
    /**
     * Notifies the parent component that it has been clicked/tapped
     * @return {void}
     */
    clicked() {
        this.parent.clicked = true;
    }
    /**
     * Notifies the parent component of the selected element
     * @param {any}    e Input event
     * @param {number} i Index of the selected item
     */
    setItem(e: any, i: number){
        if(e) { // Prevent clicking through typeahead
            if(e.preventDefault) e.preventDefault();
            if(e.stopPropagation) e.stopPropagation();
        }
        this.clicked();
        setTimeout(() => {
            this.parent.setItem(this.filtered_list[i]);
            this.parent.clicked = false;
        }, 30);
    }

    ngOnDestroy() {
    }

}


@Component({
    selector: '[typeahead]',
    styleUrls: [ './typeahead.style.css' ],
    templateUrl: './typeahead.template.html'
})
export class Typeahead {
    @Input() filter: string = '';
    @Input() filterFields: string[] = [];
    @Input() list: any[] = [];
    @Input() results: number = 5;
    @Input() show: boolean = false;
    @Input() auto: boolean = false;
    @Input() forceTop: boolean = false;
    @Input() cssClass: string = 'default';
    @Input() msg: string = '';
    @Output() selected = new EventEmitter();

    @ViewChild('main') main: ElementRef;

    shown: boolean = false;
    list_view: any = null;
    list_ref: any = null;
    last_change: number = null;
    container: any;
    id: number = 12345678;
    closing: boolean = false;
    clicked: boolean = false;
    update_timer: any = null;

    constructor(private _cr: ComponentFactoryResolver, private view: ViewContainerRef) {

    }

    ngOnChanges(changes: any) {
        if(changes.filter) {
            if(this.list_view) this.list_view.updateFilter(this.filter);
        }
        if(changes.show && !this.clicked) {
            setTimeout(() => {
                if(!this.show) this.close();
                else this.open();
            }, 200);
        } else if(changes.show) {
            setTimeout(() => {
                this.ngOnChanges(changes);
            }, 200);
        }
        if(changes.list) {
            setTimeout(() => {
                if(this.list_view){
                    this.list_view.setupList(this, this.list, this.filterFields, this.filter, this.results, this.cssClass, this.auto, this.forceTop);
                }
            }, 200);
        }
    }
    /**
     * Opens the typeahead option list
     * @return {void}
     */
    open() {
        if(this.list_ref) return;
        let now = (new Date()).getTime();
        if(now - this.last_change < 100) return;
        if(!this.shown) {
            this.render(TypeaheadList);
            this.shown = true;
        } else {
            this.close();
        }
    }
    /**
     * Close the typeahead option list
     * @return {void}
     */
    close() {
        if(!this.list_ref) return;
        this.closing = true;
        this.shown = false;
        if(this.list_ref) {
            if(this.list_ref.location.nativeElement.parent)
            this.list_ref.location.nativeElement.parent.removeChild(this.list_ref.location.nativeElement);
            this.list_ref.destroy();
            this.list_ref = null;
        }
        this.clicked = false;
        if(this.update_timer) {
            clearInterval(this.update_timer);
            this.update_timer = null;
        }
    }
    /**
     * Sets the selected item and emits it to the binding
     * @param {any} item [description]
     */
    setItem(item: any){
        this.selected.emit(item);
        this.close();
    }

    ngOnDestroy() {
        this.close();
    }
    /**
     * Creates the option list and attaches it to the DOM
     * @return {void}
     */
    private render(){
        if(this.view) {
            let factory = this._cr.resolveComponentFactory(TypeaheadList);
            let cmpRef = this.view.createComponent(factory);
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
