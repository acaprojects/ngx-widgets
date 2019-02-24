import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: '[touchpress]'
})
export class TouchPressDirective {
    @Output('touchpress') public event = new EventEmitter();

    public timer: number = null;

    @HostListener('mousedown', ['$event']) public mouse(e: MouseEvent) {
        this.emit(e);
    }

    @HostListener('touchstart', ['$event']) public touch(e: Event) {
        this.emit(e as TouchEvent);
    }

    private emit(e: MouseEvent | TouchEvent) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.timer = <any>setTimeout(() => {
            let center = { x: 0, y: 0 }
            if (e instanceof MouseEvent) {
                center = { x: e.clientX, y: e.clientY };
            } else if (e.touches && e.touches.length > 0) {
                center = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            this.event.emit({ ...e, center });
            this.timer = null;
        }, 20);
    }
}

