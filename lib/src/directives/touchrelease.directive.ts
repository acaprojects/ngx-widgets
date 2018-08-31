import { Directive, Output, EventEmitter, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
    selector: '[touchrelease]'
})
export class TouchReleaseDirective {
    @Input() public variance = 40;
    @Output('touchrelease') public event = new EventEmitter();

    private model: any = {};
    private timers: any = {};

    @HostListener('mousedown', ['$event']) public mousestart(e: any) {
        this.start(e)
    }

    @HostListener('touchstart', ['$event']) public touchstart(e: any) {
        this.start(e);
    }


    @HostListener('mouseup', ['$event']) public mouse(e: any) {
        this.emit(e);
    }

    @HostListener('touchend', ['$event']) public touch(e: any) {
        this.emit(e);
    }

    private start(e: any) {
        if (!e || !e.target) { return; }
        this.timers.start = setTimeout(() => {
            if (!e.center) {
                if (e.touches && e.touches.length > 0) {
                    e.center = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                } else {
                    e.center = { x: e.clientX, y: e.clientY };
                }
            }
            const box = e.target.getBoundingClientRect();
            this.model.target = { x: e.center.x - (box.left + box.width / 2), y: e.center.y - (box.top + box.height / 2) };
        }, 20);
    }

    private emit(e: any) {
        if (!e || !e.target) { return; }
        if (this.timers.emit) {
            clearTimeout(this.timers.emit);
            this.timers.emit = null;
        }
        this.timers.emit = setTimeout(() => {
            if (!e.center) {
                if (e.touches && e.touches.length > 0) {
                    e.center = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                } else {
                    e.center = { x: e.clientX, y: e.clientY };
                }
            }
            const box = e.target.getBoundingClientRect();
            const center = { x: e.center.x - (box.left + box.width / 2), y: e.center.y - (box.top + box.height / 2) };
            if (this.nearby(this.model.target, center)) {
                this.event.emit(e);
            }
            this.timers.emit = null;
        }, 20);
    }

    private nearby(start: {x: number, y: number}, end: {x: number, y: number}) {
        if (!start || !end) { return false; }
        return end.x > start.x - this.variance && end.x < start.x + this.variance &&
            end.y > start.y - this.variance && end.y < start.y + this.variance;
    }
}

