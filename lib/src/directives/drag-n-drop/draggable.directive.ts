
import { Directive, ElementRef, HostListener, Renderer2, Input } from '@angular/core';
import { DragNDropService } from '../../services/dragndrop.service';

@Directive({
    selector: '[is-draggable]'
})
export class DraggableDirective {
    @Input('is-draggable') public group: string = 'root';
    @Input() public id: string = '';
    @Input() public name: string;

    private model: any = {};

    @HostListener('press', ['$event']) public pressed(e) {
        if (this.el && this.el.nativeElement) {
            const set_class = name || 'dragging';
            this.renderer.addClass(this.el.nativeElement, set_class);
            const box = this.el.nativeElement.getBoundingClientRect();
            this.service.drag(this.el.nativeElement.cloneNode(true), {
                offset: { x: e.center.x - box.left, y: e.center.y - box.top },
                size: { height: box.height, width: box.width },
                start: e.center,
                id: this.id
            }, this.group);
            const clear = {
                mouse: this.renderer.listen('window', 'mouseup', () => {
                    this.renderer.removeClass(this.el.nativeElement, set_class);
                        // Clear event listener
                    if (clear.mouse) { clear.mouse(); }
                    if (clear.touch) { clear.touch(); }
                    this.service.release(this.group);
                }),
                touch: this.renderer.listen('window', 'touchend', () => {
                    this.renderer.removeClass(this.el.nativeElement, set_class);
                        // Clear event listener
                    if (clear.mouse) { clear.mouse(); }
                    if (clear.touch) { clear.touch(); }
                    this.service.release(this.group);
                }),

            };
        }
    }

    @HostListener('contextmenu', ['$event']) public contextMenu(e) {
        e.preventDefault();
    }

    constructor(private el: ElementRef, private renderer: Renderer2, private service: DragNDropService) { }
}
