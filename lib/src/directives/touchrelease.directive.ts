import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[touchrelease]'
})
export class TouchReleaseDirective {
    @Output('touchrelease') public event = new EventEmitter();

    public timer: any = null;

    @HostListener('mouseup', ['$event']) public mouse(e: any) {
        this.emit(e);
    }

    @HostListener('touchend', ['$event']) public touch(e: any) {
        this.emit(e);
    }

    private emit(e: any) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = setTimeout(() => {
            if (!e.center) {
                if (e.touches && e.touches.length > 0) {
                    e.center = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                } else {
                    e.center = { x: e.clientX, y: e.clientY };
                }
            }
            this.event.emit(e);
            this.timer = null;
        }, 20);
    }
}

