import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    selector: 'tapdown'
})
export class TapDownDirective {
    @Output('tapdown') public tapdown = new EventEmitter();

    @HostListener('mousedown', ['$event']) private mouse(e: any) {
        this.tapdown.emit(e);
    }

    @HostListener('touchstart', ['$event']) private touch(e: any) {
        this.tapdown.emit(e);
    }
}

