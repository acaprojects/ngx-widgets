import { Directive, Output, EventEmitter, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
    selector: '[touchrelease]'
})
export class TouchReleaseDirective {
    @Input() public variance = 40;
    @Output('touchrelease') public event = new EventEmitter();

    private model: { [name: string]: any } = {};
    private timers: { [name: string]: number } = {};

    @HostListener('mousedown', ['$event']) public mousestart(e: MouseEvent) {
        this.start(e)
    }

    @HostListener('touchstart', ['$event']) public touchstart(e: Event) {
        this.start(e as TouchEvent);
    }


    @HostListener('mouseup', ['$event']) public mouse(e: MouseEvent) {
        this.emit(e);
    }

    @HostListener('touchend', ['$event']) public touch(e: Event) {
        this.emit(e as TouchEvent);
    }

    private start(e: MouseEvent | TouchEvent) {
        if (!e || !e.target) { return; }
        this.timers.start = <any>setTimeout(() => {
            const center = this.getCenter(e);
            const box = (e.target as HTMLElement).getBoundingClientRect();
            this.model.target = { x: center.x - (box.left + box.width / 2), y: center.y - (box.top + box.height / 2) };
        }, 20);
    }

    private emit(e: MouseEvent | TouchEvent) {
        if (!e || !e.target) { return; }
        if (this.timers.emit) {
            clearTimeout(this.timers.emit);
            this.timers.emit = null;
        }
        this.timers.emit = <any>setTimeout(() => {
            const c = this.getCenter(e);
            const box = (e.target as HTMLElement).getBoundingClientRect();
            const center = { x: c.x - (box.left + box.width / 2), y: c.y - (box.top + box.height / 2) };
            if (this.nearby(this.model.target, center)) {
                this.event.emit(e);
            }
            this.timers.emit = null;
        }, 20);
    }

    private getCenter(e: MouseEvent | TouchEvent) {
        let center = { x: 0, y: 0 }
        if (e instanceof MouseEvent) {
            center = { x: e.clientX, y: e.clientY };
        } else if (e.touches && e.touches.length > 0) {
            center = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return center
    }

    private nearby(start: {x: number, y: number}, end: {x: number, y: number}) {
        if (!start || !end) { return false; }
        return end.x > start.x - this.variance && end.x < start.x + this.variance &&
            end.y > start.y - this.variance && end.y < start.y + this.variance;
    }
}

