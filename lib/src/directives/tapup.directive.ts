import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: 'tapup'
})
export class TapUpDirective {
    @Output('tapup') public tapup = new EventEmitter();

    @HostListener('mouseup', ['$event']) private mouse(e: any) {
        this.tapup.emit(e);
    }

    @HostListener('touchend', ['$event']) private touch(e: any) {
        this.tapup.emit(e);
    }
}

