/**
* @Author: Alex Sorafumo
* @Date:   07/02/2017 11:56 AM
* @Email:  alex@yuion.net
* @Filename: tooltip.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 07/02/2017 5:22 PM
*/

import { Component, Input, Output, ElementRef, ViewChild, EventEmitter, Renderer } from '@angular/core';
import { ComponentFactoryResolver, ViewContainerRef, HostListener } from '@angular/core'

const POS_LIST: string[] = ['bottom', 'top', 'left', 'right'];

@Component({
    selector: '[tooltip]',
    templateUrl: './tooltip.template.html',
    styleUrls: ['./tooltip.styles.css']
})
export class TooltipComponent {
    @Input() offset: string = '0';
    @Input() offsetType: string = 'left';
    @Input() size: string = '1.0em';
    @Input() position: string = 'bottom';
    @Input() theme: string = 'light';
    @Input() show: boolean = false;
    @Input() cssClass: string = 'default';
    @Input() cmp: any = null;
    @Input() html: string = '';
    @Input() data: any = {};

    @Output() showChange = new EventEmitter();
    @Output() change = new EventEmitter();

    toggle_timer: any = null;

    @ViewChild('area') content: ElementRef;
    @ViewChild('content', { read: ViewContainerRef }) view: ViewContainerRef;

    private _cmp: any = null; // Created component
    private _inst: any = null; // Component Instance

    /**
     * Function call when the element that this is attached to is tapped
     * emits a ontap event
     * @param  {any}    e Hammer Tap event returned by Angular 2
     * @return {void}
     */
    @HostListener('tap', ['$event'])
    onClick(e: any) {
    	if(!this.check(e)){
	        this.toggleShow();
	    }
    }

    constructor(private el: ElementRef, private _cfr: ComponentFactoryResolver, private renderer: Renderer) {

    }

    ngOnChanges(changes: any) {
           // Component changes or state of show changes to true
        if(changes.cmp) {
            setTimeout(() => {
                this.render();
            }, 20);
        }
            // Offset has changed
        if(changes.offset || changes.offsetType) {
            this.updateOffset();
        }
    }

    /**
     * Updates the offset position of the content box of the tooltip
     * @return {void}
     */
    private updateOffset() {
        if(this.content) {
            let el = this.content.nativeElement;
            this.renderer.setElementStyle(el, 'top', '');
            this.renderer.setElementStyle(el, 'left', '');
            this.renderer.setElementStyle(el, 'bottom', '');
            this.renderer.setElementStyle(el, 'right', '');
            if(this.offsetType in el.style) {
            	this.renderer.setElementStyle(el, this.offsetType, this.offset);
            }
        } else {
            setTimeout(() => {
                this.updateOffset();
            }, 50);
        }
    }
    /**
     * Toggles whether or not the tooltip is shown
     * @return {void}
     */
    toggleShow() {
        this.show = !this.show;
        this.showChange.emit(this.show);
        this.toggle_timer = setTimeout(() => {
        	this.toggle_timer = null;
        }, 100);
    }
    /**
     * Checks if the given event occurred outside the tool tip and hides it if so
     * @param  {any}    e Hammer Tap Event
     * @return {void}
     */
    checkTap(e: any) {
        if(!this.toggle_timer && !this.check(e)) {
            this.show = false;
            this.toggle_timer = setTimeout(() => {
                this.toggle_timer = null;
            }, 100);
        }
    }
    /**
     * Checks if the the given event occurred inside the tooltip
     * @param  {any}    e Event
     * @return {boolean} Returns whether or not the event occurred inside the tooltip
     */
    check(e: any) {
        let inside = false;
        if(e && this.content) {
            let pos = { x: 0, y: 0 };
            let bb = this.content.nativeElement.getBoundingClientRect();
            if(e.center) {
                pos = e.center;
            } else {
                pos = { x: e.clientX, y: e.clientY };
            }
            if(pos.x >= bb.left && pos.x <= bb.left + bb.width && pos.y >= bb.top && pos.y <= bb.top + bb.height) {
                inside = true;
            }
        }
        return inside;
    }
    /**
     * Emits a change made within the tooltip
     * @param  {string} type Type of change made
     * @param  {any}    data Data associated with change
     * @return {void}
     */
    causeChange(type: string, data?: any) {
        let odata = {
            type: type,
            data: data
        };
        this.change.emit(odata);
    }
    /**
     * Renders the given component inside the tooltip
     * @param  {number = 0} cnt Retry counter
     * @return {void}
     */
    private render(cnt: number = 0) {
        if(this.cmp && this.view) {
    		let factory = this._cfr.resolveComponentFactory(this.cmp);
            if(this._cmp) this._cmp.destroy();
            this._cmp = this.view.createComponent(factory);
                // let's inject @Inputs to component instance
            this._inst = this._cmp.instance;
            this._inst.entity = this.data;
            if(!this._inst.entity) this._inst.entity = {};
            this._inst.parent = this;
            if(this._inst.init) this._inst.init();
            this.updateOffset();
        } else if(cnt < 30) {
            cnt++;
            setTimeout(() => {
                this.render(cnt);
            }, 100 * cnt);
        }
    }
}
