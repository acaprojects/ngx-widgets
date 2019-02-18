
import { Directive, ElementRef, HostListener, Renderer2, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { DragNDropService } from '../../services/dragndrop.service';

@Directive({
    selector: '[is-draggable]'
})
export class DraggableDirective implements AfterViewInit {
    @Input('is-draggable') public group: string = 'root';
    @Input() public id: string = '';
    @Input() public name: string;
    @Output() public event = new EventEmitter();

    private model: { [name: string]: any } = {};

    @HostListener('drag', ['$event']) public dragged(e) {
        this.dragging(e);
    }

    @HostListener('press', ['$event']) public pressed(e) {
        this.dragging(e);
    }

    @HostListener('contextmenu', ['$event']) public contextMenu(e) {
        e.preventDefault();
    }

    constructor(private el: ElementRef, private renderer: Renderer2, private service: DragNDropService) { }

    public ngAfterViewInit() {
        if (this.el && this.el.nativeElement) {
            this.renderer.setAttribute(this.el.nativeElement, 'draggable', 'true');
        }
    }

    private dragging(e) {
        if (this.el && this.el.nativeElement) {
            const set_class = name || 'dragging';
            this.renderer.addClass(this.el.nativeElement, set_class);
            const box = this.el.nativeElement.getBoundingClientRect();
                // Update service
            this.service.drag(this.el.nativeElement.cloneNode(true), {
                offset: { x: e.center.x - box.left, y: e.center.y - box.top },
                size: { height: box.height, width: box.width },
                start: e.center,
                id: this.id
            }, this.group);
                // Post drag event
            this.event.emit({
                offset: { x: e.center.x - box.left, y: e.center.y - box.top },
                size: { height: box.height, width: box.width },
                start: e.center,
                id: this.id
            });
            this.model.clear = {
                mouse: this.renderer.listen('window', 'mouseup', () => this.release(set_class)),
                touch: this.renderer.listen('window', 'touchend', () => this.release(set_class)),
                dragend: this.renderer.listen('window', 'dragend', () => this.release(set_class))
            };
        }
    }

    private release(set_class: string) {
        this.renderer.removeClass(this.el.nativeElement, set_class);
            // Clear event listener
        if (this.model.clear.mouse) { this.model.clear.mouse(); }
        if (this.model.clear.touch) { this.model.clear.touch(); }
        this.service.release(this.group);
    }
}
