/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   18/11/2016 4:31 PM
* @Email:  alex@yuion.net
* @Filename: slider.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 01/02/2017 11:52 AM
*/

import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ACA_Animate } from '../../../services/animate.service';

declare let Hammer: any;

@Component({
    selector: 'slider',
    templateUrl: './slider.template.html',
    styleUrls: [ './slider.styles.css' ]
})
export class Slider {
    @Input() align: string = 'horizontal';
    @Input() min: number = 0;
    @Input() max: number = 100;
    @Input() value: number = 0;
    @Input() step: number = 1;
    @Input() precision: number = 1;
    @Input() cssClass: string = '';
    @Output() valueChange = new EventEmitter();
    @Output() delayValueChange = new EventEmitter();
    //*
    @ViewChild('space') space: any;
    @ViewChild('bar')   bar: any;
    @ViewChild('knob')  knob: any;
    @ViewChild('prog')  prog: any;

    available: boolean = false;
    previous: number = 0;
    position: number = 0;
    percent: number = 0;
    bb : any;
    change_timer: any = null;

    constructor(private a: ACA_Animate){
    }

    ngAfterViewInit(){
        this.available = true;
    }

    ngOnChanges(changes: any){
        if(this.min > this.max) {
            this.min = 0;
            this.max = 100;
        }
        if(!this.step) this.step = 1;
        if(!this.precision) this.precision = 1;
        if(this.min === undefined || this.min === null) this.min = 0;
        if(this.min === undefined || this.min === null) this.max = 100;
        if(!this.knob) {
            this.refresh();
        }
        if(changes.value) {
            if(this.value < this.min) {
                this.value = this.min
            } else if(this.value > this.max) {
                this.value = this.max;
            }
            this.refresh(false);
        }
    }

    ngDoCheck() {
        if(this.previous !== this.value) {
            this.previous = this.value;
            this.refresh();
        }
    }
    /**
     * Gets the offset of the slider bar
     * @return {void}
     */
    getBarOffset(){
        let dim = {
            x : 0,
            y : 0
        };
        if(!this.bar) return dim;
        if(!this.bb) this.bb = this.bar.nativeElement.getBoundingClientRect();
        let el = this.bb;
        dim.x = el.left;
        dim.y = el.top
        return dim;
    }
    /**
     * Update value of the slider
     * @param  {boolean = false}       update Do we need to update the display
     * @return {void}
     */
    updateValue(update:boolean = false) {
        if(!this.knob || !this.bar || !this.prog) {
            setTimeout(() => { this.updateValue(update); }, 20);
        } else if(update) {
        	this.a.animation(() => {}, () => {
		        let range = +this.max - +this.min;
		        let percent = (this.value - this.min) / range;
                this.percent = Math.round(percent*10000)/100;
            }).animate();
        }
    }
    /**
     * Emits the value throught the output binding
     * @return {void}
     */
    postValue() {
        if(this.change_timer) {
            clearTimeout(this.change_timer);
            this.change_timer = null;
        }
        this.valueChange.emit(this.value);
        this.change_timer = setTimeout(() => {
            this.delayValueChange.emit(this.value);
            this.change_timer = null;
        }, 300);
    }
    /**
     * Calculates the new value of the slider using the position of the event
     * @param  {any}    event Tap/Pan event
     * @return {number} Returns the new value of the slider
     */
    calcValue(event: any) {
        if(event) {
            if(event.preventDefault) event.preventDefault();
            if(event.stopPropagation) event.stopPropagation();
        } else {
            return this.value;
        }
        let align = this.align ? this.align.toLowerCase() : '';
        let isVertical = align.indexOf('vert') >= 0;
        let pos: number, percent: number = 0;
        let center: { x: number, y: number } = event.center ? event.center : { x: event.clientX, y: event.clientY };
        if(this.bar) {
            if (!isVertical) {
                pos = center.x - this.getBarOffset().x;
                percent = pos / this.bar.nativeElement.offsetWidth;
            } else {
                pos = center.y - this.getBarOffset().y;
                percent = 1 - (pos / this.bar.nativeElement.offsetHeight);
            }
        }

        // Normalise the range
        let range = +this.max - +this.min;

        // expand the value to an number min...max, and clip
        // it to a multiple of step
        let stepped = Math.round((percent * range) / +this.step) * +this.step;

        // round the stepped value to a precision level
        var rounded = Math.round(stepped * +this.precision) / +this.precision;
        // constraint min..X..max
        return Math.min(+this.max, Math.max(+this.min, (rounded + +this.min)));
    }

   	checkStatus(e: any, i: number) {
        if(event) {
            if(event.preventDefault) event.preventDefault();
            if(event.stopPropagation) event.stopPropagation();
        }
   		if(i > 3 || !this.space) return;
   		let visible = false;
   		let el = this.space.nativeElement;
   		while(el) {
   			if(el.nodeName === 'BODY') {
   				visible = true;
   				break;
   			}
   			el = el.parentNode;
   		}
   		if(!visible) setTimeout(() => { this.checkStatus(e, i+1); }, 100);
   		else this.resize();
   	}

    /**
     * Updates the value and position of the slider based of the event
     * @param  {any}    event Tap event
     * @return {void}
     */
    clickSlider(event: any) {
        if(event) {
            if(event.preventDefault) event.preventDefault();
            if(event.stopPropagation) event.stopPropagation();
        }
        this.value = this.calcValue(event);
        this.updateValue();
    }

    /**
     * Updates the position of the progress and knob of the slider
     * @param  {any}    event Pan event
     * @return {void}
     */
    moveSlider(event: any){
        if(event) {
            if(event.preventDefault) event.preventDefault();
            if(event.stopPropagation) event.stopPropagation();
        }
        let prev = this.value;
        this.value = this.calcValue(event);
        this.refresh();
    }


    /**
     * Updates the position of the progress and knob of the slider
     * @param  {any}    event PanEnd event
     * @return {void}
     */
    sliderStop(event: any){
        if(event) {
            if(event.preventDefault) event.preventDefault();
            if(event.stopPropagation) event.stopPropagation();
        }
        this.refresh();
    }
    /**
     * Update slider positioning when the window is resized
     * @return {void}
     */
    resize(){
        if(this.bar) this.bb = this.bar.nativeElement.getBoundingClientRect();
        this.updateValue(true);
    }

    refresh(post: boolean = true){
        this.updateValue(true);
        if(post) this.postValue();
    }
}
