import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ACA_Animate } from '../../services/animate.service';

declare let Hammer: any;

@Component({
    selector: '[slider]',
    directives: [ ],
    providers: [ ACA_Animate ],
    templateUrl: './slider.html',
    styles: [
        require('./slider.scss')
    ]
})
export class Slider {
    @Input() align;
    @Input() min: number = 0;
    @Input() max: number = 100;
    @Input() value: number = 0;
    @Input() step: number = 1;
    @Input() precision: number = 1;
    @Input() cssClass: string = '';
    @Output() valueChange = new EventEmitter();
    //*
    @ViewChild('vspace') vspace:any;
    @ViewChild('hspace') hspace:any;
        //Slider Bar
    @ViewChild('barVert') vslider:any;
    @ViewChild('barHorz') hslider:any;
        //Slider Knob
    @ViewChild('knobVert') vknob:any;
    @ViewChild('knobHorz') hknob:any;
        //Slider Progress Strip
    @ViewChild('progressVert') vprog:any;
    @ViewChild('progressHorz') hprog:any;

    available: boolean = false;
    position: number = 0;
    knob: ElementRef;
    bar: ElementRef;
    prog: ElementRef;
    space: ElementRef;
    de: any;
    touchbar: any;
    touchknob: any;
    bb : any;

    constructor(private a: ACA_Animate){
    }

    ngAfterViewInit(){
        this.available = true;
        this.initElements();
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
            this.initElements();
            this.refresh();
        }
        if(changes.value) this.refresh();
    }

    initElements(){
        this.space = this.align === 'horizontal' ? this.hspace : this.vspace;
        this.bar = this.align === 'horizontal' ? this.hslider : this.vslider;
        this.knob = this.align === 'horizontal' ? this.hknob : this.vknob;
        this.prog = this.align === 'horizontal' ? this.hprog : this.vprog;
            //Setup Interactive Events
        //*
        if(Hammer && this.bar && this.knob){
                // Setup events via Hammer.js if it is included
            let fn = (event) => {
                let data;
                data = {};
                if(event.pointerType === 'mouse'){
                    data = event.srcEvent;
                    this.moveSlider(data);
                } else if(event.pointerType === 'touch') {
                    if(event.srcEvent.changedTouches.length > 0){
                        data = event.srcEvent.changedTouches[event.srcEvent.changedTouches.length -1];
                        data.srcElement = event.srcEvent.srcElement;
                        data.offsetX = data.pageX - this.getBarOffset().x;
                        data.offsetY = data.pageY - this.getBarOffset().y;
                        this.moveSlider(data);
                    }
                }
            };
            this.de = new Hammer(document, {});
            this.de.on('tap', () => { this.checkStatus(null, 0); });
            this.touchbar = new Hammer(this.space.nativeElement, {});
            this.touchbar.on('tap', fn);
            this.touchbar.on('pan', fn);
            if(this.align === 'vertical'){
                this.touchbar.get('pan').set({ directive: Hammer.DIRECTION_VERTICAL, threshold: 5 });
            } else {
                this.touchbar.get('pan').set({ directive: Hammer.DIRECTION_HORIZONTAL, threshold: 5 });
            }
        } else if(this.bar && this.knob){
                //Setup Normal Events
                //*
            let fn = (event) => {
                this.clickSlider(event);
            }
            this.bar.nativeElement.onmousedown = fn;
            this.bar.nativeElement.ontouchdown = fn;
                //*/
        }
        //*/
    }

    getBarOffset(){
        let dim = {
            x : 0,
            y : 0
        };
        if(!this.bb) this.bb = this.bar.nativeElement.getBoundingClientRect();
        let el = this.bb;
        dim.x = el.left;
        dim.y = el.top
        return dim;
    }

    slideStart(){

    }

    slideEnd(event) {
        document.onmousemove = null;
        document.onmouseup = null;
        document.ontouchmove = null;
        document.ontouchend = null;
    }

    slideUpdate(event) {
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
        if(!this.knob) {
            this.initElements();
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

    calcValue(event) {
        let pos, percent;
        if (this.align === 'horizontal') {
            pos = event.clientX - this.getBarOffset().x;
            percent = pos / this.bar.nativeElement.offsetWidth;
        } else {
            pos = event.clientY - this.getBarOffset().y;
            percent = 1 - (pos / this.bar.nativeElement.offsetHeight);
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

   	checkStatus(e, i) {
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


    clickSlider(event) {
        if(document.onmousemove !== null) return;
        this.value = this.calcValue(event);
        this.updateValue();
        document.onmouseup = (event) => {
            this.sliderStop(event);
        };
        document.onmousemove = (event) => {
            this.moveSlider(event);
        };
    }

    moveSlider(event){
        let prev = this.value;
        this.value = this.calcValue(event);
        this.refresh();
    }

    sliderStop(event){
        this.slideEnd(event);
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
