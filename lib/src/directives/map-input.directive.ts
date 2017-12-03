
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { Animate } from '../services/animate.service';


@Directive({
    selector: '[map-input]',
})
export class MapInputDirective {
    @Input() public center: { x: number, y: number };
    @Input() public scale: number;
    @Input() public angle: number;
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

    constructor(private el: ElementRef, private animate: Animate) {

    }

    public ngOnInit() {
        this.init();
    }

    public init() {
        if (!this.el && !this.el.nativeElement) {
            setTimeout(() => {
                this.init();
            }, 200);
            return;
        }
        this.box = this.el.nativeElement.getBoundingClientRect();
        if (!this.animations.center) {
            this.animations.center = this.animate.animation(() => { }, () => {
                this.centerChange.emit(this.center);
            });
        }
        if (!this.animations.scale) {
            this.animations.scale = this.animate.animation(() => { }, () => {
                this.scaleChange.emit(this.scale);
            });
        }
    }

    @HostListener('panstart', ['$event']) private moveStart(e: any) {
        this.model.center = this.center;
    }

    @HostListener('panmove', ['$event']) private moveEvent(e: any) {
        const scale = (100 + this.scale) / 100;
        this.center = {
            x: this.model.center.x + (e.deltaX / this.box.width) / scale,
            y: this.model.center.y + (e.deltaY / this.box.height) / scale,
        };
        if (this.center.x > 1) { this.center.x = 1; }
        else if (this.center.x < 0) { this.center.x = 0; }
        if (this.center.y > 1) { this.center.y = 1; }
        else if (this.center.y < 0) { this.center.y = 0; }
        this.animations.center.animate();
    }

    @HostListener('pinchstart', ['$event']) private scaleStart(e: any) {
        this.delta.scale = e.scale;
        console.log('Pinch Start:', e.scale.toFixed(5), this.scale);
    }

    @HostListener('pinchin', ['$event']) private pinchInEvent(e: any) {
        this.updateScale(e);
        console.log('Pinch In:', e.scale.toFixed(5), this.scale);
    }

    @HostListener('pinchout', ['$event']) private pinchOutEvent(e: any) {
        this.updateScale(e);
        console.log('Pinch Out:', e.scale.toFixed(5), this.scale);
    }

    private updateScale(e: any) {
        const scale = (e.scale - this.delta.scale) / 10;
        const dir = scale > 0 ? 1 : -1;
        const value = 1 + dir * Math.max(Math.abs(scale), 0.08);
        this.scale = Math.round((this.scale + 100) * value - 100);
        this.delta.scale += scale;
        this.animations.scale.animate();
    }

    @HostListener('pinchend', ['$event']) private scaleEnd(e: any) {
        this.delta.scale = 0;
        console.log('Pinch End:', e.scale.toFixed(5), this.scale);
    }

    @HostListener('wheel', ['$event']) private wheelScale(e: any) {
        const value = 1 + -(0.01 * e.deltaY) / 2;
        this.scale = Math.round((this.scale + 100) * value - 100);
        if (this.scale < -50) {
            this.scale = -50;
        }
        this.animations.scale.animate();
    }

    @HostListener('click', ['$event']) private tap(e: any) {
        this.event.emit({ type: 'Tap', event: e });
    }
}
