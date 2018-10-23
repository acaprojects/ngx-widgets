
import { Component, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import * as faker from 'faker';

@Component({
    selector: 'app-playground',
    templateUrl: './playground.template.html',
    styleUrls: ['./playground.styles.scss']
})
export class PlaygroundComponent {
    public model: any = {};
    public listener: any = {};

    @ViewChild('tablist') private tabs: ElementRef;
    @ViewChildren('tab') private tab_list: QueryList<ElementRef>;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.model.cmp_list = [
            { id: 'full-calendar', name: 'Full Calendar' }
        ]
        this.model.category_list = ['component', 'javascript', 'styling'];

    }

    public ngOnInit() {
        this.model.cmp_index = -1;
        this.listener.route = this.route.paramMap.subscribe((params) => {
            if (params.has('component')) {
                const cmp = params.get('component');
                let found = false;
                for (const item of this.model.cmp_list) {
                    if (item.id === cmp) {
                        found = true;
                        this.model.component = item;
                        break;
                    }
                }
                if (!found) { this.router.navigate(['playground']); }
            }
        });
        this.model.events = {
            'Alex Sorafumo': [],
            'Ben Hoad': [],
            'William Le': [],
            'Jonathan McFarlane': []
        };
        for (const key in this.model.events) {
            if (this.model.events.hasOwnProperty(key)) {
                const person = this.model.events[key];
                const count = Math.floor(Math.random() * 8 + 4);
                const now = moment().hours(6).minutes(30);
                for (let i = 0; i < count; i++) {
                    now.add(Math.floor(Math.random() * 6) * 15, 'm');
                    const start = now.valueOf();
                    const duration = Math.floor(Math.random() * 6 + 2) * 15;
                    person.push({
                        id: `${key}-${i}`,
                        title: `${faker.commerce.productName()} Testing`,
                        date: start,
                        duration
                    });
                    now.add(duration, 'm');
                }
            }
        }
        setTimeout(() => this.setCategory(this.model.category_list[0]), 100);
    }

    public select(cmp) {
        if (cmp && cmp.id) {
            this.router.navigate(['playground', cmp.id]);
        }
    }

    public setCategory(value: string) {
        this.model.category = value;
        this.model.binding = null;
        const tabs = this.tab_list.toArray();
        const tab = tabs[this.model.category_list.indexOf(value)];
        if (tab) {
            const root_rect = this.tabs.nativeElement.getBoundingClientRect();
            const rect = tab.nativeElement.getBoundingClientRect();
            this.model.tab = {
                left: rect.left - root_rect.left,
                width: rect.width,
            };
        }
        setTimeout(() => this.highlight(), 50);
    }

    private highlight() {

    }
}
