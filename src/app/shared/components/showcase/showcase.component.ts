
import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
    selector: 'showcase',
    templateUrl: './showcase.template.html',
    styleUrls: ['./showcase.styles.scss']
})
export class ShowcaseComponent {
    @Input() public model: any = {};

    public state: any = {};

    @ViewChild('tablist') private tabs: ElementRef;
    @ViewChildren('tab') private tab_list: QueryList<ElementRef>;

    public ngOnInit() {
        this.state.category_list = ['overview', 'bindings', 'playground'];
        setTimeout(() => this.setCategory(this.state.category_list[0]));
    }

    public setCategory(value: string) {
        this.state.category = value;
        const tabs = this.tab_list.toArray();
        const tab = tabs[this.state.category_list.indexOf(value)];
        if (tab) {
            const root_rect = this.tabs.nativeElement.getBoundingClientRect();
            const rect = tab.nativeElement.getBoundingClientRect();
            this.state.tab = {
                left: rect.left - root_rect.left,
                width: rect.width,
            };
        }
    }
}
