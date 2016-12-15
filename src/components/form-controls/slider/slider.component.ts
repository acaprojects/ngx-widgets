/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   18/11/2016 4:31 PM
* @Email:  alex@yuion.net
* @Filename: slider.component.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:29 AM
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
    //*
    @ViewChild('space') space: any;
    @ViewChild('bar')   bar: any;
    @ViewChild('knob')  knob: any;
    @ViewChild('prog')  prog: any;

    available: boolean = false;
    position: number = 0;
    bb : any;

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
        if(!this.min) this.min = 0;
        if(!this.max) this.max = 100;
        if(!this.knob) {
            this.refresh();
        }
        if(changes.value) this.refresh();
    }

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

    slideUpdate(event: any) {
        if(event) {
            if(event.preventDefault) event.preventDefault();
            if(event.stopPropagation) event.stopPropagation();
        }
        if(this.align === 'vertical') {
            this.value = this.max - Math.round((event.relativePercentVertical/100 * (this.max - this.min)) + this.min);
        } else {
            this.value = Math.round((event.relativePercentHorizontal/100 * (this.max - this.min)) + this.min);
        }
        if(this.value < this.min) this.value = this.min;
        else if(this.value > this.max) this.value = this.max;
        this.valueChange.emit(this.value);
    }

    updateValue(update:boolean = false) {
        if(!this.knob || !this.bar || !this.prog) {
            setTimeout(() => { this.updateValue(update); }, 20);
        } else if(update) {
        	this.a.animation(() => {}, () => {
		        let range = +this.max - +this.min;
		        let percent = (this.value - this.min) / range;
	            if(this.align === 'horizontal') {
	                this.knob.nativeElement.style.left = percent*this.bar.nativeElement.offsetWidth + 'px';
	                this.prog.nativeElement.style.width = percent*this.bar.nativeElement.offsetWidth + 'px';
	            } else {
	                this.knob.nativeElement.style.top = (1-percent)*this.bar.nativeElement.offsetHeight + 'px';
	                this.prog.nativeElement.style.height = (percent)*this.bar.nativeElement.offsetHeight + 'px';
	                this.prog.nativeElement.style.top = (1-percent)*this.bar.nativeElement.offsetHeight + 'px';
	            }
            }).animate();
        }
        this.valueChange.emit(this.value);
    }

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


    clickSlider(event: any) {
        if(event) {
            if(event.preventDefault) event.preventDefault();
            if(event.stopPropagation) event.stopPropagation();
        }
        this.value = this.calcValue(event);
        this.updateValue();
    }

    moveSlider(event: any){
        if(event) {
            if(event.preventDefault) event.preventDefault();
            if(event.stopPropagation) event.stopPropagation();
        }
        let prev = this.value;
        this.value = this.calcValue(event);
        this.refresh();
    }

    sliderStop(event: any){
        if(event) {
            if(event.preventDefault) event.preventDefault();
            if(event.stopPropagation) event.stopPropagation();
        }
        this.refresh();
    }

    resize(){
        if(this.bar) this.bb = this.bar.nativeElement.getBoundingClientRect();
        this.updateValue(true);
    }

    refresh(){
        this.updateValue(true);
    }
}
