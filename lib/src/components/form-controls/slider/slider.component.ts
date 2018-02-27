/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   18/11/2016 4:31 PM
 * @Email:  alex@yuion.net
 * @Filename: slider.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 01/02/2017 11:52 AM
 */

 import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
 import { Animate } from '../../../services/animate.service';

 import { WIDGETS } from '../../../settings';

 @Component({
     selector: 'slider',
     templateUrl: './slider.template.html',
     styleUrls: [ './slider.styles.scss' ],
 })
 export class SliderComponent {
     @Input() public align = 'horizontal';
     @Input() public min = 0;
     @Input() public max = 100;
     @Input() public value = 0;
     @Input() public step = 1;
     @Input() public precision = 1;
     @Input() public name = '';
     @Output() public valueChange = new EventEmitter();

     public available = false;
     public current = 0;
     public position = 0;
     public percent = 0;

     @ViewChild('space') private space: any;
     @ViewChild('bar') private bar: any;

     private previous: number = null;
     private bb: any;
     private change_timer: any = null;
     private user_action = false;
     private action_timer: any = null;
     private update_timer: any = null;
     private stop_timer: any = null;

     constructor(private a: Animate) {
     }

     public ngAfterViewInit() {
         this.available = true;
     }

     public ngOnChanges(changes: any) {
         if (changes.min || changes.max || changes.value) {
             this.validate();
         }
         if (!this.step) {
             this.step = 1;
         }
         if (!this.precision) {
             this.precision = 1;
         }
         if (changes.value && !this.user_action && !isNaN(this.value)) {
             if (this.value < this.min) {
                 this.value = this.min;
             } else if (this.value > this.max) {
                 this.value = this.max;
             }
             this.current = this.value;
             this.updateValue(true);
         }
     }

     public validate() {
         if (this.min > this.max) {
             WIDGETS.log('Slider', 'Min > Max');
             this.min = 0;
             this.max = 100;
         }
         if (this.min === undefined || this.min === null) {
             WIDGETS.log('Slider', 'Min Undefined');
             this.min = 0;
         }
         if (this.min === undefined || this.min === null) {
             WIDGETS.log('Slider', 'Max Undefined');
             this.max = 100;
         }
         if (isNaN(this.min)) {
             WIDGETS.log('Slider', 'Min NaN');
             this.min = this.max < 0 ? this.max - this.step * 5 : 0;
         }
         if (isNaN(this.max)) {
             WIDGETS.log('Slider', 'Max NaN');
             this.max = this.min > 100 ? this.min + this.step * 5 : 100;
         }
         if (isNaN(this.value)) {
            this.value = this.min;
        }
     }

    /**
     * Update value of the slider
     * @param update Do we need to update the display
     * @return
     */
     public updateValue(update: boolean = false) {
         if (!this.bar) {
             setTimeout(() => { this.updateValue(update); }, 20);
         } else if (update) {
             this.a.animation(() => {
                 return;
             }, () => {
                 const range = +this.max - +this.min;
                 const percent = (this.current - this.min) / range;
                 this.percent = Math.round(percent * 10000) / 100;
             }).animate();
         }
     }

    /**
     * Updates the value and position of the slider based of the event
     * @param event Tap event
     * @return
     */
     public clickSlider(event: any) {
         if (event) {
             if (event.preventDefault) {
                 event.preventDefault();
             }
             if (event.stopPropagation) {
                 event.stopPropagation();
             }
         }
         const prev = this.current;
         this.current = this.value = this.calcValue(event);
         this.actionPerformed();
         this.refresh();
     }

    /**
     * Updates the position of the progress and knob of the slider
     * @param event Pan event
     * @return
     */
     public moveSlider(event: any) {
         if (event) {
             if (event.preventDefault) {
                 event.preventDefault();
             }
             if (event.stopPropagation) {
                 event.stopPropagation();
             }
         }
         const prev = this.current;
         this.current = this.value = this.calcValue(event);
         this.user_action = true;
         this.refresh();
         if (this.stop_timer) {
             clearTimeout(this.stop_timer);
             this.stop_timer = null;
         }
         this.stop_timer = setTimeout(() => {
             this.sliderStop(event);
         }, 300);
     }

    /**
     * Updates the position of the progress and knob of the slider
     * @param event PanEnd event
     * @return
     */
     public sliderStop(event: any) {
         if (event) {
             if (event.preventDefault) {
                 event.preventDefault();
             }
             if (event.stopPropagation) {
                 event.stopPropagation();
             }
         }
         this.actionPerformed();
         this.refresh();
     }
    /**
     * Update slider positioning when the window is resized
     * @return
     */
     public resize() {
         if (this.bar) {
             this.bb = this.bar.nativeElement.getBoundingClientRect();
         }
         this.updateValue(true);
     }

     public checkStatus(e: any, i: number) {
         if (event) {
             if (event.preventDefault) {
                 event.preventDefault();
             }
             if (event.stopPropagation) {
                 event.stopPropagation();
             }
         }
         if (i > 3 || !this.space) {
             return;
         }
         let visible = false;
         let el = this.space.nativeElement;
         // Check if component is attached to the body of the page
         while (el) {
             if (el.nodeName === 'BODY') {
                 visible = true;
                 break;
             }
             el = el.parentNode;
         }
         if (!visible) {
             setTimeout(() => { this.checkStatus(e, i + 1); }, 100);
         } else {
             this.resize();
         }
     }
    /**
     * Emits the value throught the output binding
     * @return
     */
     private postValue() {
         setTimeout(() => {
             if (this.user_action) {
                 if (!this.update_timer) {
                     clearTimeout(this.update_timer);
                     this.update_timer = null;
                 }
                 this.update_timer = setTimeout(() => {
                     this.valueChange.emit(this.current);
                     this.update_timer = null;
                 }, 180); // Delay timer for posting value changes.
             }
         }, 20);
     }
    /**
     * Calculates the new value of the slider using the position of the event
     * @param event Tap/Pan event
     * @return Returns the new value of the slider
     */
     private calcValue(event: any) {
         if (event) {
             if (event.preventDefault) {
                 event.preventDefault();
             }
             if (event.stopPropagation) {
                 event.stopPropagation();
             }
         } else {
             return this.current;
         }
         const align = this.align ? this.align.toLowerCase() : '';
         const isVertical = align.indexOf('vert') >= 0;
         let pos: number;
         let percent = 0;
         const center: { x: number, y: number } = event.center ? event.center : { x: event.clientX, y: event.clientY };
         if (this.bar) {
             if (!isVertical) {
                 pos = center.x - this.getBarOffset().x;
                 percent = pos / this.bar.nativeElement.offsetWidth;
             } else {
                 pos = center.y - this.getBarOffset().y;
                 percent = 1 - (pos / this.bar.nativeElement.offsetHeight);
             }
         }

         // Normalise the range
         const range = +this.max - +this.min;

         // expand the value to an number min...max, and clip
         // it to a multiple of step
         const stepped = Math.round((percent * range) / +this.step) * +this.step;

         // round the stepped value to a precision level
         const rounded = Math.round(stepped * +this.precision) / +this.precision;
         // constraint min..X..max
         return Math.min(+this.max, Math.max(+this.min, (rounded + +this.min)));
     }

     private actionPerformed() {
         if (this.update_timer) {
             clearTimeout(this.update_timer);
             this.update_timer = null;
         }
         this.user_action = false;
         if (this.action_timer) {
             clearTimeout(this.action_timer);
             this.action_timer = null;
         }
         this.user_action = true;
         this.action_timer = setTimeout(() => {
             this.user_action = false;
             this.action_timer = null;
         }, 300);

     }

    /**
     * Gets the offset of the slider bar
     * @return
     */
     private getBarOffset() {
         const dim = {
             x : 0,
             y : 0,
         };
         if (!this.bar) {
             return dim;
         }
         if (!this.bb) {
             this.bb = this.bar.nativeElement.getBoundingClientRect();
         }
         const el = this.bb;
         dim.x = el.left;
         dim.y = el.top;
         return dim;
     }

     private refresh(post: boolean = true) {
         this.updateValue(true);
         if (post) {
             this.postValue();
         }
     }
 }
