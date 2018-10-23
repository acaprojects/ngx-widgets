
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnChanges } from '@angular/core';

@Component({
    selector: 'dropdown',
    templateUrl: './dropdown.template.html',
    styleUrls: ['./dropdown.styles.scss'],
})
export class DropdownComponent implements OnChanges {
    @Input() public name = '';
    @Input() public list: any[] = [];
    @Input() public model = 0;
    @Input() public filter = false;
    @Input() public placeholder = '';
    @Input() public hideActive = false;
    @Input() public html = '';
    @Output() public filterValue: any = new EventEmitter();
    @Output() public modelChange: any = new EventEmitter();

    @ViewChild('ref') private reference: ElementRef;
    @ViewChild('body') private body: ElementRef;
    @ViewChild('active') private active: ElementRef;
    @ViewChild('input') private input: ElementRef;

    public show = false;
    public font_size = 20;
    public width = 200;
    public list_items: any[] = [];
    public filtered_list: any[] = [];
    public bottom = false;
    public search = '';

    public ngOnChanges(changes: any) {
        if (changes.list) {
            this.processList();
        }
        setTimeout(() => this.resize(), 300);
    }

    public select(index: number = 0) {
        this.model = index;
        this.modelChange.emit(this.model);
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
            this.filtered_list = this.list_items;
        }
        this.filterValue.emit(this.search);
    }


    private processList() {
        if (this.list) {
            const list: any[] = [];
            for (const item of this.list) {
                if (typeof item === 'object') {
                    list.push(item || { name: '' });
                } else {
                    list.push({ name: item });
                }
            }
            this.list_items = list;
            this.filterItems();
        }
    }

}
