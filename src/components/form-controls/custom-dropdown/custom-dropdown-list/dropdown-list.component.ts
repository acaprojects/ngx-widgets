
import { Component, ElementRef, ViewChild } from '@angular/core';

import { OverlayContentComponent } from '../../../overlays/contents';

@Component({
    selector: 'dropdown-list',
    templateUrl: './dropdown-list.template.html',
    styleUrls: ['./dropdown-list.styles.scss'],
})
export class CustomDropdownListComponent extends OverlayContentComponent {
    public search: string = '';
    public filtered_list: any[] = [];

    @ViewChild('input') private input: ElementRef;

    public set(data: any) {
        super.set(data);
        setTimeout(() => {
            this.filter();
        }, 20);
    }

    public filter() {
        if (this.search) {
            const s = this.search.toLowerCase();
            this.filtered_list = [];
            let index = 0;
            for (const i of this.model.list) {
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
            this.filtered_list = this.model.list;
        }
    }

    public focus() {
        if (this.input) {
            this.input.nativeElement.focus();
        }
    }

    public select(index: number) {
        this.model.active = index;
        this.fn.event('Select');
    }
}
