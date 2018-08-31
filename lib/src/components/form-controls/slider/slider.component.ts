/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   18/11/2016 4:31 PM
 * @Email:  alex@yuion.net
 * @Filename: slider.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 01/02/2017 11:52 AM
 */

import { Component, EventEmitter, Input, Output, ViewChild, OnChanges } from '@angular/core';
import { Animate } from '../../../services/animate.service';

import { WIDGETS } from '../../../settings';

@Component({
    selector: 'slider',
    templateUrl: './slider.template.html',
    styleUrls: ['./slider.styles.scss'],
})
export class SliderComponent implements OnChanges {
    @Input() public align = 'horizontal';
    @Input() public min = 0;
    @Input() public max = 100;
    @Input() public model = 0;
    @Input() public step = 1;
    @Input() public name = '';
    @Output() public modelChange = new EventEmitter();

    public available = false;
    public current = 0;
    public position = 0;
    public percent = 0;

    @ViewChild('space') private space: any;
    @ViewChild('bar') private bar: any;

    private previous: number = null;
    private bb: any;
    private timers: any = {};
    private user_action = false;

    constructor(private a: Animate) {
    }

    public ngAfterViewInit() {
        this.available = true;
    }

    public ngOnChanges(changes: any) {
        if (changes.min || changes.max || changes.model) {
            this.validate();
        }
        if (!this.step) {
            this.step = 1;
        }
        if (changes.model && !this.user_action && !isNaN(this.model)) {
            if (this.model < this.min) {
                this.model = this.min;
            } else if (this.model > this.max) {
                this.model = this.max;
            }
            this.current = this.model;
            this.updateValue(true);
        }
    }

    public validate() {
        if (this.min > this.max) {
            WIDGETS.log('Slider', 'Min > Max');
            this.min = 0;
            this.max = 100;
        }
        if (isNaN(this.max)) {
            WIDGETS.log('Slider', 'Max NaN');
            this.max = this.min > 100 ? this.min + this.step * 5 : 100;
        }
        if (this.min === undefined || this.min === null) {
            WIDGETS.log('Slider', 'Min Undefined');
            this.min = 0;
        } else if (this.min === undefined || this.min === null) {
            WIDGETS.log('Slider', 'Max Undefined');
            this.max = 100;
        } else if (isNaN(this.min)) {
            WIDGETS.log('Slider', 'Min NaN');
            this.min = this.max < 0 ? this.max - this.step * 5 : 0;
        }
        if (isNaN(this.model)) {
            this.model = this.min;
        }
    }

    /**
     * Update model of the slider
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
     * Updates the model and position of the slider based of the event
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
        this.current = this.model = this.calcValue(event);
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
        this.current = this.model = this.calcValue(event);
        this.user_action = true;
        this.refresh();
        if (this.timers.stop) {
            clearTimeout(this.timers.stop);
            this.timers.stop = null;
        }
        this.timers.stop = setTimeout(() => this.sliderStop(event), 300);
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
    public resize(resized: boolean = false, tries: number = 0) {
        if (resized) {
            this.timers.resize = null;
            if (tries > 10) { return; }
            if (this.bar && this.bar.nativeElement) {
                this.bb = this.bar.nativeElement.getBoundingClientRect();
            } else {
                return setTimeout(() => this.resize(resized, ++tries), 400);
            }
            this.updateValue(true);
        } else {
            if (this.timers.resize) {
                clearTimeout(this.timers.resize);
                this.timers.resize = null;
            }
            this.timers.resize = setTimeout(() => this.resize(true), 300);
        }
    }

    public checkStatus(e: any, i: number) {
        if (event) {
            if (event.preventDefault) { event.preventDefault(); }
            if (event.stopPropagation) { event.stopPropagation(); }
        }
        if (i > 3 || !this.space) { return; }
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
     * Emits the model throught the output binding
     * @return
     */
    private postValue() {
        setTimeout(() => {
            if (this.user_action) {
                if (!this.timers.update) {
                    clearTimeout(this.timers.update);
                    this.timers.update = null;
                }
                this.timers.update = setTimeout(() => {
                    this.modelChange.emit(this.current);
                    this.timers.update = null;
                }, 180); // Delay timer for posting model changes.
            }
        }, 20);
    }
    /**
     * Calculates the new model of the slider using the position of the event
     * @param event Tap/Pan event
     * @return Returns the new model of the slider
     */
    private calcValue(event: any) {
        if (event) {
            if (event.preventDefault) { event.preventDefault(); }
            if (event.stopPropagation) { event.stopPropagation(); }
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

        // expand the model to an number min...max, and clip
        // it to a multiple of step
        const stepped = Math.round((percent * range) / +this.step) * +this.step;

        // constraint min..X..max
        return Math.min(+this.max, Math.max(+this.min, (stepped + +this.min)));
    }

    private actionPerformed() {
        if (this.timers.update) {
            clearTimeout(this.timers.update);
            this.timers.update = null;
        }
        this.user_action = false;
        if (this.timers.action) {
            clearTimeout(this.timers.action);
            this.timers.action = null;
        }
        this.user_action = true;
        this.timers.action = setTimeout(() => {
            this.user_action = false;
            this.timers.action = null;
        }, 300);

    }

    /**
     * Gets the offset of the slider bar
     * @return
     */
    private getBarOffset() {
        const dim = { x: 0, y: 0 };
        if (!this.bar || !this.bar.nativeElement) {
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
