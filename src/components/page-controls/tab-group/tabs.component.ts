/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: tabs.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:32 AM
 */

import { Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { AfterContentInit, ContentChildren, QueryList, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TabBody } from './tab-body.component';
import { TabHead } from './tab-head.component';

@Component({
    selector: 'tab-group',
    templateUrl: './tabs.template.html',
    styleUrls: [ './tabs.styles.css' ],
})
export class TabGroup implements AfterContentInit  {

    @Input() public state: string = '0';
    @Input() public routable: string = ''; // Search, Query, Hash, Route
    @Input() public routeParam: string = 'tab'; //
    @Input() public cssClass: string = 'default';
    @Input() public disabled: string[] = [];
    @Output() public stateChange = new EventEmitter();

        // Toggle Knob
    @ContentChildren(TabHead) private tabHeaders: QueryList<TabHead>;
    @ContentChildren(TabBody) private tabBodies: QueryList<TabBody>;
    @ViewChild('header') private header: ElementRef;
    @ViewChild('body') private body: ElementRef;

    private active: TabBody;
    private rvalue: string;
    private qvalue: string;
    private hvalue: string;
    private node_list: string[] = [];
    private content_init: boolean = false;
    private content_timer: any = null;
    private child_cnt: number = 0;
    private empty: any = null;
    private head_timer: any = null;

    private head_cnt: number = 0;

    constructor(private loc: Location, private route: ActivatedRoute,
                private _router: Router, private renderer: Renderer2) {

        this.route.params.map((params) => params[this.routeParam]).subscribe((params) => {
            this.rvalue = params;
        });
        this.processRoute();
        this.empty = this.renderer.createElement('div');
        this.renderer.addClass(this.empty, 'empty');
    }

    public ngAfterContentInit() {
        this.initElements();
        if (this.routableValid()) {
                // Get Route Value
            setTimeout(() => {
                if (this.routeValue && this.routeValue !== this.state) {
                    this.setActiveTab(this.routeValue);
                }
            }, 100);
        }
        if (!this.content_timer) {
            this.content_timer = setInterval(() => {
                this.checkChildren();
            }, 500);
        }
    }

    public ngAfterViewInit() {
        this.renderer.appendChild(this.header.nativeElement, this.empty);
    }

    public ngOnChanges(changes: any) {
        if (changes.disabled) {
            this.updateDisable();
        }
        if (changes.state) {
            this.setActiveTab(this.state);
        }
    }

    public ngDoCheck() {
        if (this.content_init && this.tabHeaders && this.tabHeaders.toArray().length !== this.head_cnt) {
            this.head_cnt = this.tabHeaders.toArray().length;
            this.injectContents();
        }
    }

    public processRoute() {
        const path = this.loc.path();
        if (path.indexOf('?') >= 0) {
            const query = path.substring(path.indexOf('?') + 1, path.length);
            const q: any = query.split('&');
            for (const i in q) {
                if (!(q[i] instanceof Function)) {
                    const param = q[i].split('=');
                    if (param[0] === this.routeParam) {
                        this.qvalue = param[1];
                        break;
                    }
                }
            }
        } else if (path.indexOf('#') >= 0) {
            const hash = path.substring(path.indexOf('#') + 1, path.length);
            const h: any = hash.split('&');
            for (const i in h) {
                if (!(h[i] instanceof Function)) {
                    const param = h[i].split('=');
                    if (param[0] === this.routeParam) {
                        this.hvalue = param[1];
                        break;
                    }
                }
            }

        }
    }

    get routeValue() {
        let value = '';
        switch (this.routable.toLowerCase()) {
            case 'query':
            case 'search':
                value = this.qvalue;
                break;
            case 'hash':
                value = this.hvalue;
                break;
            case 'route':
                value = this.rvalue;
                break;
        }
        return value;
    }

    public routableValid() {
        return this.routable &&
                (this.routable.toLowerCase() === 'search' ||
                 this.routable.toLowerCase() === 'query' ||
                 this.routable.toLowerCase() === 'hash' ||
                 this.routable.toLowerCase() === 'route' );
    }

    public setActiveTab(id: string, init: boolean = false) {
        if (this.head_timer || this.disabled.indexOf(id) >= 0 || !this.tabBodies || !this.tabHeaders) {
            return;
        }
        this.state = id;

        const tabs = this.tabHeaders.toArray();
        for (let i = 0; i < this.tabHeaders.length; i++) {
            tabs[i].parent = this;
            if (tabs[i].id === id) {
                tabs[i].active();
            } else {
                tabs[i].inactive();
            }
        }
        const content = this.tabBodies.toArray();
        for (let i = 0; i < this.tabBodies.length; i++) {
            tabs[i].parent = this;
            if (content[i].id === id) {
                this.active = content[i];
            } else {
                content[i].hide();
            }
        }
        if (this.active) {
            this.active.show();
        }
        setTimeout(() => {
            this.stateChange.emit(this.state);
            if (this.routableValid() && !init) {
                this.updateRouteValue();
            }
        }, 20);
        this.head_timer = setTimeout(() => {
            this.head_timer = null;
        }, 200);
    }

    public updateDisable() {
        if (!this.tabHeaders || !this.tabBodies) {
            setTimeout(() => {
                this.updateDisable();
            }, 200);
        } else {
            const tabs = this.tabHeaders.toArray();
            for (let i = 0; i < this.tabHeaders.length; i++) {
                if (this.disabled.indexOf(tabs[i].id) >= 0) {
                    tabs[i].hide();
                } else {
                    tabs[i].show();
                }
            }
                // Set active tab to the first available tab if the current tab is disabled
            if (this.disabled.indexOf(this.state) >= 0) {
                for (const tab of tabs) {
                    if (this.disabled.indexOf(tab.id) < 0) {
                        this.setActiveTab(tab.id);
                        break;
                    }
                }
            }
        }
    }

    public updateRouteValue() {
        let route = this.loc.path();
        if (this.routable.toLowerCase() === 'route') {
            route = route.replace('/' + this.rvalue, '/' + this.state);
            this.rvalue = this.state;
        } else if (this.routable.toLowerCase() === 'query' || this.routable.toLowerCase() === 'search') {
            route = route.replace(this.routeParam + '=' + this.qvalue, this.routeParam + '=' + this.state);
        } else if (this.routable.toLowerCase() === 'hash') {
            route = route.replace(this.routeParam + '=' + this.hvalue, this.routeParam + '=' + this.state);
        }
        this.loc.replaceState(route);
        this.processRoute();
    }

    private checkChildren() {
        if (this.tabHeaders && this.tabHeaders.length !== this.child_cnt) {
            if (!this.child_cnt) {
                this.initElements();
            }
            this.child_cnt = this.tabHeaders.length;
        }
    }

    private initElements() {
            // Setup Tabs Header
        if (!this.state) {
            if (this.tabHeaders.first) {
                this.state = this.tabHeaders.first.id;
            }
        }
        this.injectContents();
            // Setup active tab
        this.setActiveTab(this.state, true);
        this.content_init = true;
    }

    private injectContents() {
            // Inject Tab Headers into the page
        let tabs: any[] = this.tabHeaders.toArray();
        for (let i = 0; i < this.tabHeaders.length; i++) {
            this.addHeadNode(tabs[i]);
        }
            // Inject Tab Bodies into the page
        tabs = this.tabBodies.toArray();
        for (let i = 0; i < this.tabBodies.length; i++) {
            this.addBodyNode(tabs[i]);
        }
    }

    private addHeadNode(node: any) {
        const root = this.header;
        if (!root || !node || this.node_list.indexOf(node.id) >= 0) {
            return;
        }
        this.renderer.insertBefore(root.nativeElement, node.nativeElement(), this.empty);
        this.node_list.push(`head-${node.id}`);
    }

    private addBodyNode(node: any) {
        const root = this.body;
        if (!root || !node || this.node_list.indexOf(node.id) >= 0) {
            return;
        }
        this.renderer.appendChild(root.nativeElement, node.nativeElement());
        this.node_list.push(`body-${node.id}`);
    }

}
