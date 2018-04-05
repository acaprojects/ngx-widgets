
import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import * as hljs from 'highlight.js';

@Component({
    selector: 'showcase',
    templateUrl: './showcase.template.html',
    styleUrls: ['./showcase.styles.scss'],
    animations: [
        trigger('show', [
            transition(':enter', [style({ opacity: 0, position: 'absolute', left: 0, right: 0 }), animate('300ms ease-in', style({ opacity: 1 }))]),
            transition(':leave', [style({ opacity: 1, position: 'absolute', left: 0, right: 0 }), animate('300ms ease-out', style({ opacity: 0 }))])
        ])
    ]
})
export class ShowcaseComponent {
    @Input() public model: any = {};

    public state: any = {};

    @ViewChild('tablist') private tabs: ElementRef;
    @ViewChildren('tab') private tab_list: QueryList<ElementRef>;

    @ViewChild('inject') private inject_block: ElementRef;
    @ViewChild('binding') private binding_block: ElementRef;
    @ViewChild('example') private example_block: ElementRef;

    public ngOnInit() {
        this.state.category_list = ['overview', 'bindings', 'playground'];
        this.state.bindings = {};
        this.state.playground = 'bindings';
        setTimeout(() => this.setCategory(this.state.category_list[0]), 50);
    }

    public setCategory(value: string) {
        this.state.category = value;
        this.state.binding = null;
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
        setTimeout(() => this.highlight(), 50);
    }

    public selectBinding(binding: any) {
        this.state.binding = binding;
        setTimeout(() => this.highlight(), 50);
    }

    public highlight() {
        if (this.inject_block && this.inject_block.nativeElement) {
            hljs.highlightBlock(this.inject_block.nativeElement);
        }
        if (this.binding_block && this.binding_block.nativeElement) {
            hljs.highlightBlock(this.binding_block.nativeElement);
        }
        if (this.example_block && this.example_block.nativeElement) {
            hljs.highlightBlock(this.example_block.nativeElement);
        }
    }
}
