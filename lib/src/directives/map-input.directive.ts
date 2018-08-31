
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, OnChanges } from '@angular/core';

import { Animate } from '../services/animate.service';

const POS_OFFSET = .5;

@Directive({
    selector: '[map-input]',
})
export class MapInputDirective implements OnChanges {
    @Input() public center: { x: number, y: number };
    @Input() public lock: boolean;
    @Input() public scale: number;
    @Input() public angle: number;
    @Input() public el: any;
    @Output() public centerChange: any = new EventEmitter();
    @Output() public scaleChange: any = new EventEmitter();
    @Output() public event: any = new EventEmitter();

    private model: any = {};
    private delta: any = {};
    private move: any = { x: 0, y: 0 };
    private timer: any = {};
    private min = 0;
    private box: any = null;
    private animations: any = {
        center: null,
        scale: null,
        angle: null,
    };

    constructor(private animate: Animate) { }

    public ngOnInit() {
        this.init();
    }

    public init() {
        if (!this.el) {
            return setTimeout(() => this.init(), 200);
        }
        this.box = this.el.getBoundingClientRect();
        if (!this.animations.center) {
            this.animations.center = this.animate.animation(() => {
                this.checkBounds();
            }, () => {
                this.centerChange.emit(this.center);
            });
        }
        if (!this.animations.scale) {
            this.animations.scale = this.animate.animation(() => {
                this.checkBounds();
            }, () => {
                this.scaleChange.emit(this.scale);
            });
        }
        this.timer.scale = null;
    }

    public ngOnChanges(changes: any) {
        if (changes.scale && this.el) {
            this.box = this.el.getBoundingClientRect();
        }
        if (changes.el) {
            this.init();
        }
    }

    @HostListener('panstart', ['$event']) private moveStart(e: any) {
        if (this.timer.scale) { return; }
        if (this.lock) { return; }
        this.model.center = this.center;
    }

    @HostListener('panmove', ['$event']) private moveEvent(e: any) {
        if (this.timer.scale) { return; }
        if (this.lock) { return; }
        if (!this.timer.move) {
            this.timer.move = setTimeout(() => {
                this.center = {
                    x: this.model.center.x + (e.deltaX / (this.box.width)),
                    y: this.model.center.y + (e.deltaY / (this.box.height)),
                };
                this.animations.center.animate();
                this.timer.move = null;
            }, 100)
        }
    }

    @HostListener('pinchstart', ['$event']) private scaleStart(e: any) {
        this.delta.scale = e.scale;
        this.model.scaling = true;
    }

    @HostListener('pinchend', ['$event']) private scaleEnd(e: any) {
        if (this.timer.scale) {
            clearTimeout(this.timer.scale);
            this.timer.scale = null;
        }
        this.model.scaling = false;
    }

    @HostListener('pinchin', ['$event']) private pinchInEvent(e: any) {
        if (e.scale > this.delta.scale) { this.delta.scale = e.scale; }
        this.updateScale(e, -1);
    }

    @HostListener('pinchout', ['$event']) private pinchOutEvent(e: any) {
        if (e.scale < this.delta.scale) { this.delta.scale = e.scale; }
        this.updateScale(e, 1);
    }

    private updateScale(e: any, dir: 1 | -1) {
        if (this.timer.scale) { return; }
        this.timer.scale = setTimeout(() => {
            if (this.lock) { return; }
            let scale = (e.scale - this.delta.scale);
            this.delta.scale = e.scale;
            const value = 1 + scale;
            this.scale = Math.round((this.scale + 100) * value - 100);
            this.animations.scale.animate();
            this.timer.scale = null;
        }, 40);
    }

    @HostListener('wheel', ['$event']) private wheelScale(e: any) {
        if (this.lock) { return; }
        if (e.preventDefault) { e.preventDefault(); }
        const value = 1 + -((e.deltaY / Math.abs(e.deltaY) / 4)) / 2;
        this.scale = Math.round((this.scale + 100) * value - 100);
        this.animations.scale.animate();
    }

    @HostListener('mouseup', ['$event']) private click(e: any) {
        if (this.timer.scale || this.model.scaling) { return; }
        this.event.emit({ type: 'Tap', event: e });
    }

    @HostListener('touchend', ['$event']) private touch(e: any) {
        if (this.timer.scale || this.model.scaling) { return; }
        this.event.emit({ type: 'Tap', event: e });
    }

    private checkBounds() {
        // Check position is valid
        if (this.center.x < 0 - POS_OFFSET) { this.center.x = -POS_OFFSET; }
        else if (this.center.x > 1 + POS_OFFSET) { this.center.x = 1 + POS_OFFSET; }
        if (this.center.y < 0 - POS_OFFSET) { this.center.y = -POS_OFFSET; }
        else if (this.center.y > 1 + POS_OFFSET) { this.center.y = 1 + POS_OFFSET; }
        // Check zoom is valid
        if (this.scale < 0) { this.scale = 0; }
        else if (this.scale > 1900) { this.scale = 1900; }
    }

}
