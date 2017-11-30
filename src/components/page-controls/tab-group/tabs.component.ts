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
import { AfterContentInit, ContentChildren, QueryList, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TabHead } from './tab-head.component';

@Component({
    selector: 'tab-group',
    templateUrl: './tabs.template.html',
    styleUrls: [ './tabs.styles.scss' ],
})
export class TabGroup {

    @Input() public state: string = '0';
    @Input() public routable: string = ''; // Search, Query, Hash, Route
    @Input() public routeParam: string = 'tab'; //
    @Input() public name: string = '';
    @Input() public disabled: string[] = [];
    @Output() public stateChange = new EventEmitter();

    public model: any = {};

    @ContentChildren(TabHead) private tabHeaders: QueryList<TabHead>;

    private rvalue: string;
    private qvalue: string;
    private hvalue: string;
    private check: number = 0;

    constructor(private loc: Location, private route: ActivatedRoute, private _router: Router) {
        this.route.params.map((params) => params[this.routeParam]).subscribe((params) => {
            this.rvalue = params;
        });
        this.processRoute();
    }

    public ngOnChanges(changes: any) {
        if (changes.tabHeaders) {
            this.processNodes();
        }
        if (changes.state) {
            this.active = this.state;
        }
    }

    public ngDoCheck() {
        if (this.tabHeaders) {
            const headers = this.tabHeaders.toArray() || [];
            this.check = (this.check + 1) % ( headers ? headers.length || 1 : 1 );
            if (headers && headers.length > 0 && (!this.model.headers || this.model.headers.length !== headers.length || this.model.headers[this.check] !== headers[this.check])) {
                this.processNodes();
            }
        }
    }

    public processNodes() {
        if (this.tabHeaders) {
            this.model.headers = this.tabHeaders.toArray();
            for (const head of this.model.headers) {
                head.parent = this;
            }
            this.active = this.state;
        }
    }

    set active(state: string) {
        if (this.model.headers) {
            for (const head of this.model.headers) {
                if (head.id === state) {
                    this.model.active = head;
                    head.active = true;
                } else {
                    head.active = false;
                }
            }
        }
        this.state = state;
        this.stateChange.emit(state);
    }

    public setHeadTemplate(id: string, template: TemplateRef<any>) {
        if (!this.model.headers) {
            this.model.headers = [];
        }
        this.model.headers.push({
            id,
            template,
        });
    }

    public setBodyTemplate(id: string, template: TemplateRef<any>) {
        if (!this.model.bodies) {
            this.model.bodies = {};
        }
        this.model.bodies[id] = template;
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

}
