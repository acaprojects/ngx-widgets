
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnChanges, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { BaseFormWidgetComponent } from '../../../shared/base-form.component';

@Component({
    selector: 'dropdown',
    templateUrl: './dropdown.template.html',
    styleUrls: ['./dropdown.styles.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DropdownComponent),
        multi: true
    }]
})
export class DropdownComponent extends BaseFormWidgetComponent<number> implements OnChanges, ControlValueAccessor {
    @Input() public list: string[] | { name: string; [fields: string]: any }[] = [];
    @Input() public filter = false;
    @Input() public placeholder = '';
    @Input() public hideActive = false;
    @Input() public html = '';
    @Output() public filterValue: any = new EventEmitter<string>();

    @ViewChild('ref') private reference: ElementRef;
    @ViewChild('body') private body: ElementRef;
    @ViewChild('active') private active: ElementRef;
    @ViewChild('input') private input: ElementRef;

    @ViewChild(CdkVirtualScrollViewport) private viewport: CdkVirtualScrollViewport;

    public show = false;
    public longest: string;
    public font_size = 20;
    public width = 200;
    public list_height = 0;
    public list_items: any[] = [];
    public filtered_list: any[] = [];
    public bottom = false;
    public search = '';

    public ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
        if (changes.list) {
            this.processList();
        }
        this.timeout('resize', () => this.resize());
    }

    public select(index: number = 0) {
        this.model = index;
        this.modelChange.emit(this.model);
        this.change(this.model);
        this.show = false;
    }

    public focus() {
        if (this.input) {
            this.input.nativeElement.focus();
        }
    }

    public showList() {
        this.resize();
        this.show = true;
        this.updateScroll();
    }

    public updateScroll() {
        if (!this.viewport) {
            return this.timeout('scroll', () => this.updateScroll(), 50);
        }
        this.viewport.scrollToIndex(this.model);
    }

    public updateSize(tries: number = 0) {
        if (tries > 10) { return; }
        if (this.body && this.body.nativeElement) {
            this.width = this.body.nativeElement.offsetWidth;
        } else {
            setTimeout(() => this.updateSize(++tries), 200);
        }
    }

    public resize() {
        this.updateSize();
        if (this.reference && this.reference.nativeElement) {
            const box = this.reference.nativeElement.getBoundingClientRect();
            this.font_size = box.height;
        }
        if (this.active && this.active.nativeElement) {
            const box = this.active.nativeElement.getBoundingClientRect();
            const top = box.top + box.height / 2;
            const height = window.innerHeight || document.body.clientHeight;
            this.bottom = top > height / 2;
            this.processList();
        }
    }

    public filterItems() {
        if (this.search) {
            const s = this.search.toLowerCase();
            this.filtered_list = [];
            let index = 0;
            for (const i of this.list_items) {
                if (typeof i === 'string' && i.toLowerCase().indexOf(s) >= 0) {
                    this.filtered_list.push({
                        i: index,
                        name: i,
                    });
                } else if (i.name && i.name.toLowerCase().indexOf(s) >= 0) {
                    this.filtered_list.push({
                        i: index,
                        name: i.name,
                    });
                }
                index++;
            }
        } else {
            this.filtered_list = [ ...this.list_items ];
        }
        this.list_height = Math.min(8, this.filtered_list.length);
        this.filterValue.emit(this.search);
    }


    private processList() {
        if (this.list) {
            const list: any[] = [];
            this.longest = '1';
            for (const item of this.list) {
                if (typeof item === 'object') {
                    list.push(item || { name: '' });
                    if (item && item.name.length > this.longest.length) { this.longest = item.name; }
                } else {
                    list.push({ name: item });
                    if (item && item.length > this.longest.length) {  this.longest = item; }
                }
            }
            this.list_items = list;
            this.filterItems();
        }
    }

}
