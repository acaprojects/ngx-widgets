/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: tabs.component.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:32 AM
*/

import { Component, Input, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { ViewChild, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { TabBody } from './tab-body.component';
import { TabHead } from './tab-head.component';

@Component({
    selector: 'tab-group',
    templateUrl: './tabs.template.html',
    styleUrls: [ './tabs.styles.css' ]
})
export class TabGroup implements AfterContentInit  {

    @Input() state: string = '0';
    @Input() routable: string = ''; // Search, Query, Hash, Route
    @Input() routeParam: string = 'tab'; //
    @Input() cssClass: string = 'default';
    @Output() stateChange = new EventEmitter();

    //*
        //Toggle Knob
    @ContentChildren(TabHead) tabHeaders: QueryList<TabHead>;
    @ContentChildren(TabBody) tabBodies: QueryList<TabBody>;
    @ViewChild('header') header: ElementRef;
    @ViewChild('body') body: ElementRef;

    active: TabBody;
    rvalue: string;
    qvalue: string;
    hvalue: string;
    listeners: any = {};
    node_list: string[] = [];
    content_init: boolean = false;

    constructor(private loc : Location, private route: ActivatedRoute, private _router: Router, private renderer: Renderer){
        this.route.params.map(params => params[this.routeParam]).subscribe(params => {
            this.rvalue = params;
        })
        this.processRoute();
    }

    ngAfterContentInit(){
        this.initElements();
        console.log('Contents Initialised');
        if(this.routableValid()) {
                // Get Route Value
            setTimeout(() => {
                if(this.routeValue && this.routeValue !== this.state) this.setActiveTab(this.routeValue);
            }, 100);
        }
    }

    head_cnt: number = 0;

    ngDoCheck() {
    	if(this.content_init && this.tabHeaders && this.tabHeaders.toArray().length !== this.head_cnt){
    		this.head_cnt = this.tabHeaders.toArray().length;
    		this.injectContents();
	    }
    }

    processRoute() {
        let path = this.loc.path();
        if(path.indexOf('?') >= 0) {
            let query = path.substring(path.indexOf('?')+1, path.length);
            let q = query.split('&');
            for(var i in q){
                let param = q[i].split('=');
                if(param[0] === this.routeParam) {
                    this.qvalue = param[1];
                    break;
                }
            }
        } else if(path.indexOf('#') >= 0) {
            let hash = path.substring(path.indexOf('#')+1, path.length);
            let h = hash.split('&');
            for(var i in h){
                let param = h[i].split('=');
                if(param[0] === this.routeParam) {
                    this.hvalue = param[1];
                    break;
                }
            }

        }
    }

    get routeValue() {
        let value = '';
        switch(this.routable.toLowerCase()) {
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


    routableValid() {
        return this.routable &&
                (this.routable.toLowerCase() === 'search' ||
                 this.routable.toLowerCase() === 'query' ||
                 this.routable.toLowerCase() === 'hash' ||
                 this.routable.toLowerCase() === 'route' );
    }

    initElements(){
            // Setup Tabs Header
        if(!this.state){
            if(this.tabHeaders.first) this.state = this.tabHeaders.first.id;
        }
        this.injectContents();
            //Setup active tab
        this.setActiveTab(this.state, true);
        this.content_init = true;
    }

    injectContents() {
        	// Inject Tab Headers into the page
        let tabs: any[] = this.tabHeaders.toArray();
        for(let i = 0; i < this.tabHeaders.length; i++){
        	this.addHeadNode(tabs[i]);
        }
        	// Inject Tab Bodies into the page
        tabs = this.tabBodies.toArray();
        for(let i = 0; i < this.tabBodies.length; i++){
        	this.addBodyNode(tabs[i]);
        }
    }

    addHeadNode(node: any) {
    	let root = this.header;
    	if(!root || !node || this.node_list.indexOf(node.id) >= 0) return;

        this.renderer.projectNodes(root.nativeElement, [node.nativeElement()]);
        this.listeners[node.id] = node.listen().subscribe((id: string) => {
        	this.setActiveTab(id);
        });
        this.node_list.push(`head-${node.id}`);
    }

    addBodyNode(node: any) {
    	let root = this.body;
    	if(!root || !node || this.node_list.indexOf(node.id) >= 0) return;

        this.renderer.projectNodes(root.nativeElement, [node.nativeElement()]);
        this.node_list.push(`body-${node.id}`);
    }

    setActiveTab(id: string, init:boolean = false) {
        this.state = id;

        let tabs = this.tabHeaders.toArray();
        for(let i = 0; i < this.tabHeaders.length; i++){
            if(tabs[i].id === id) tabs[i].active();
            else tabs[i].inactive();
        }
        let content = this.tabBodies.toArray();
        for(let i = 0; i < this.tabBodies.length; i++){
            if(content[i].id === id) this.active = content[i];
            else content[i].hide();
        }
        if(this.active) {
            this.active.show();
        }
        setTimeout(() => {
            this.stateChange.emit(this.state);
            if(this.routableValid() && !init){
                this.updateRouteValue();
            }
        }, 20);
    }

    updateRouteValue() {
        let route = this.loc.path();
        if(this.routable.toLowerCase() === 'route') {
            route = route.replace('/' + this.rvalue, '/' + this.state);
            this.rvalue = this.state;
        } else if(this.routable.toLowerCase() === 'query' || this.routable.toLowerCase() === 'search') {
            route = route.replace(this.routeParam + '=' + this.qvalue, this.routeParam + '=' + this.state);
        } else if(this.routable.toLowerCase() === 'hash') {
            route = route.replace(this.routeParam + '=' + this.hvalue, this.routeParam + '=' + this.state);
        }
        this.loc.replaceState(route);
        this.processRoute();
    }

}
