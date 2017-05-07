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

import { TypeaheadList } from './typeahead-list.component';

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
                    const inputs = [
                        this, this.list, this.filterFields, this.filter,
                        this.results, this.cssClass, this.auto, this.forceTop,
                    ];
                    this.list_view.setupList(...inputs);
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
            const inputs = [
                this, this.list, this.filterFields, this.filter, this.results, this.cssClass, this.auto, this.forceTop,
            ];
            this.list_view.setupList(...inputs);
            this.list_view.moveList(this.main);

            this.update_timer = setInterval(() => {
                this.list_view.moveList(this.main);
            }, 50);
            this.list_view.none_msg = this.msg;
            return this.list;
        }
    }
}
