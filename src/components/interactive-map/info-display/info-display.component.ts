/**
 * @Author: Alex Sorafumo <alex.sorafumo>
 * @Date:   09/01/2017 12:01 PM
 * @Email:  alex@yuion.net
 * @Filename: pin.component.ts
 * @Last modified by:   alex.sorafumo
 * @Last modified time: 17/01/2017 9:40 AM
 */

import { Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentFactoryResolver, ElementRef, Renderer2 } from '@angular/core';
import { animate, group, keyframes, state, style, transition, trigger } from '@angular/core';

@Component({
    selector: 'map-info-display',
    templateUrl: './info-display.template.html',
    styleUrls: ['./info-display.styles.css'],
    animations: [
        trigger('show', [
            state('hide', style({opacity: 0, display: 'none'})),
            state('show', style({opacity: 1})),
            transition('* <=> *', animate('700ms ease-out')),
        ]),
    ],
})
export class MapInfoDisplayComponent {
    @Input() public region: any = null;
    @Input() public data: any = null;
    @Input() public cmp: any = null;
    @Input() public html: string = null;
    @Input() public show: boolean = false;
    @Input() public active: boolean = false;
    @Input() public x: number = -9999;
    @Input() public y: number = -9999;

    private id: string = '';
    private reset_timer: any = null;
    private show_timer: any = null;
    private _cmp: any = null;
    private _inst: any = null;

    @ViewChild('area') private content: ElementRef;
    @ViewChild('content', { read: ViewContainerRef }) private view: ViewContainerRef;

    constructor(private _cfr: ComponentFactoryResolver, private renderer: Renderer2) {
        this.id = Math.floor(Math.random() * 89999999 + 10000000).toString();
    }

    public ngOnInit() {

    }

    public ngOnChanges(changes: any) {
           // Component changes or state of show changes to true
        if (changes.cmp) {
            setTimeout(() => {
                this.render();
            }, 20);
        }
        if (changes.x || changes.y) {
            if (!this.x) {
                this.x = -9999;
            }
            if (!this.y) {
                this.y = -9999;
            }
        }
    }
    /**
     * Initialises the information display
     * @return {void}
     */
    private init() {

    }
    /**
     * Replace all occurance of a string within another string
     * @param  {string} str     String to modify
     * @param  {string} find    String to find
     * @param  {string} replace String to replace with
     * @return {string} Modified string
     */
    private replaceAll(str: string, find: string, replace: string) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
    /**
     * Renders the given component inside the tooltip
     * @param  {number = 0} cnt Retry counter
     * @return {void}
     */
    private render(cnt: number = 0) {
        if (this.cmp && this.view) {
            const factory = this._cfr.resolveComponentFactory(this.cmp);
            if (this._cmp) {
                this._cmp.destroy();
            }
            this._cmp = this.view.createComponent(factory);
                // let's inject @Inputs to component instance
            this._inst = this._cmp.instance;
            this._inst.entity = this.data;
            if (!this._inst.entity) {
                this._inst.entity = {};
            }
            this._inst.parent = this;
            if (this._inst.init) {
                this._inst.init();
            }
        } else if (cnt < 30) {
            cnt++;
            setTimeout(() => {
                this.render(cnt);
            }, 100 * cnt);
        }
    }

}
