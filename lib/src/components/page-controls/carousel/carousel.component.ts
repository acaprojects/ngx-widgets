
import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit, OnChanges, OnDestroy } from '@angular/core';

import { CarouselItemComponent } from './carousel-item/carousel-item.component';
import { BaseWidgetComponent } from '../../../shared/base.component';

export interface ICarouselSettings {
    items: {
        mobile: number;
        tablet: number;
        desktop: number;
    }
    break: {
        mobile: number;
        tablet: number;
    }
}

@Component({
    selector: 'carousel',
    templateUrl: './carousel.template.html',
    styleUrls: ['./carousel.style.scss']
})
export class CarouselComponent extends BaseWidgetComponent implements OnChanges, OnDestroy, AfterContentInit {
    @Input() public name: string;
    @Input() public index: number = 0;
    @Input() public settings: ICarouselSettings;
    @Output() public indexChange = new EventEmitter();
    @Output() public select = new EventEmitter();

    public model: any = {};

    @ContentChildren(CarouselItemComponent) private items: QueryList<CarouselItemComponent>;

    constructor() {
        super();
    }

    public ngOnChanges(changes: any) {
        if (changes.settings) {
            this.resize();
        }
    }

    public ngAfterContentInit() {
        if (this.subs.obs.items) {
            this.subs.obs.items instanceof Function ? this.subs.obs.items() : this.subs.obs.items.unsubscribe();
            this.subs.obs.items = null;
        }
        this.subs.obs.items = this.items.changes.subscribe(() => this.init());
        this.init();
    }

    public init() {
        this.timeout('init', () => {
                // Initialise items
            if (this.items) {
                const list = this.items.toArray();
                for (const item of list) {
                    item.parent = this;
                    item.model.index = list.indexOf(item);
                }
                this.model.item_cnt = list.length;
            }
        }, 150);
        this.resize();
    }

    /**
     * Update the positioning
     * @param value Value to change the offset index
     */
    public change(value: number = 0) {
        if (!this.model.pending) { this.model.pending = 0; }
        this.model.pending += value;
        this.timeout('change', () => {
            if (!this.model.pending) {
                this.index = 0;
            } else {
                this.index += this.model.pending;
            }
            if (this.index < 0) { this.index = 0; }
            if (this.items) {
                const list = this.items.toArray();
                if (this.index >= list.length) { this.index = list.length - 1; }
                for (const item of list) {
                    item.model.offset = this.index;
                }
            }
            this.indexChange.emit(this.index);
            this.model.pending = 0;
        }, 50);
    }

    /**
     * Post interaction with child elements
     * @param index Index of the item
     */
    public tap(index: any) {
        if (this.items) {
            const list = this.items.toArray();
            if (index < list.length && index >= 0) {
                this.select.emit(index);
            }
        }
    }

    /**
     * Update display when the window is resized
     */
    public resize() {
        this.timeout('resize', () => {
            this.model.count = 0;
            const landscape = window.innerHeight <= window.innerWidth;
            let w = window.innerWidth;
            let device = 'desktop';
                // Get biggest dimension
            if (!landscape) {
                w = window.innerHeight;
            }
                // Get breakpoints
            const mobile_break = (this.settings && this.settings.break ? this.settings.break.mobile || 840 : 840);
            const tablet_break = (this.settings && this.settings.break ? this.settings.break.tablet || 1024 : 1024);
            if (w <= mobile_break) { device = 'mobile'; }
            else if (w <= tablet_break) { device = 'tablet'; }
                // Update item display settings
            if (this.settings && this.settings.items) {
                this.model.count = this.settings.items[device];
            }
                // Get breakpoint display counts
            const mobile_count = (this.settings && this.settings.items ? this.settings.items.mobile || 2 : 2);
            const tablet_count = (this.settings && this.settings.items ? this.settings.items.tablet || 3 : 3);
            const desktop_count = (this.settings && this.settings.items ? this.settings.items.desktop || 5 : 5);
            if (!this.model.count) {
                this.model.count = device === 'desktop' ? desktop_count : (device === 'tablet' ? tablet_count : mobile_count);
            }
                // Update carousel items
            if (this.items) {
                const list = this.items.toArray();
                for (const item of list) {
                    item.model.width = 1 / this.model.count;
                    item.model.count = this.model.count;
                }
            }
        }, 100);
    }
}