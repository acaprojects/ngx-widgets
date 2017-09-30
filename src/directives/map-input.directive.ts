
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

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

    private delta: any = {};
    private move: any = { x: 0, y: 0 };
    private timer: any = {};
    private min: number = 0;
    private box: any = null;

    constructor(private el: ElementRef) {

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
    }

    @HostListener('pan', ['$event']) private moveEvent(e: any) {
        if (this.move.x === 0) { this.move.x = +e.deltaX; }
        if (this.move.y === 0) { this.move.y = +e.deltaY; }
        let dX = +e.deltaX - +this.move.x;
        dX = (Math.min(this.min, +Math.abs(dX)) * (dX < 0 ? -1 : 1));
        let dY = +e.deltaY - +this.move.y;
        dY = (Math.min(this.min, +Math.abs(dY)) * (dY < 0 ? -1 : 1));
        const scale = (100 + this.scale) / 100;
        this.center = {
            x: this.center.x + (dX / this.box.width) / scale,
            y: this.center.y + (dY / this.box.height) / scale,
        };
        this.move.x = e.deltaX;
        this.move.y = e.deltaY;
        if (this.min < 100) {
            this.min += 10;
        }
        if (this.center.x > 1) { this.center.x = 1; }
        else if (this.center.x < 0) { this.center.x = 0; }
        if (this.center.y > 1) { this.center.y = 1; }
        else if (this.center.y < 0) { this.center.y = 0; }
        this.centerChange.emit(this.center);
    }

    @HostListener('panend', ['$event']) private moveEnd(e: any) {
        this.move = { x: 0, y: 0 };
    }

    @HostListener('pinchstart', ['$event']) private scaleStart(e: any) {
        this.delta.scale = e.scale;
    }

    @HostListener('pinch', ['$event']) private scaleEvent(e: any) {
        const scale = e.scale - this.delta.scale;
        const dir = scale > 0 ? 1 : -1;
        const value = 1 + dir * Math.max(Math.abs(scale), 0.01) / 2;
        this.scale = Math.round((this.scale + 100) * value - 100);
        this.delta.scale += scale;
        this.scaleChange.emit(this.scale);
    }

    @HostListener('pinchend', ['$event']) private scaleEnd(e: any) {
        this.delta.scale = 0;
    }

    @HostListener('tap', ['$event']) private tap(e: any) {
        this.event.emit({ type: 'Tap', event: e });
    }
}
