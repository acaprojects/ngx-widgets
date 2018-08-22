
import { Directive, ElementRef, HostListener, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { DragNDropService } from '../../services/dragndrop.service';

@Directive({
    selector: '[is-dropzone]'
})
export class DropzoneDirective {
    @Input('is-dropzone') public group: string = 'root';
    @Input() public id: string;
    @Input() public name: string;
    @Input() public state: string;
    @Output() public stateChange = new EventEmitter();
    @Output() public event = new EventEmitter();

    private model: any = {};
    private timers: any = {};

    constructor(private el: ElementRef, private renderer: Renderer2, private service: DragNDropService) { }

    public ngOnInit() {
        if (!this.id) { this.id = `DZ-${Math.floor(Math.random() * 89999999 + 10000000)}`; }
        if (this.model.listener) {
            this.model.listener instanceof Function ? this.model.listener() : this.model.listener.unsubscribe();
            this.model.listener = null;
        }
        this.model.listener = this.service.listen((item) => {
            this.updateItem(item);
        });
        this.service.register(this.group, this);
    }

    public ngOnChanges(changes: any) {
        if (changes.group) {
            this.service.unregister(changes.group.previousValue, this);
            this.service.register(this.group, this);
        }
    }

    public ngOnDestroy() {
        this.service.unregister(this.group, this);
        if (this.model.listener) {
            this.model.listener instanceof Function ? this.model.listener() : this.model.listener.unsubscribe();
            this.model.listener = null;
        }
        if (this.model.events) {
            for (const key in this.model.events) {
                if (this.model.events.hasOwnProperty(key)) {
                    this.model.events[key] ? this.model.events[key]() : null;
                }
            }
            this.model.events = null;
        }
    }

    private updateItem(item: any) {
        if (!this.el || !this.el.nativeElement) {
            return setTimeout(() => this.updateItem(item), 300);
        }
        if (item && item.el && item.group === this.group) {
            this.model.item_id = item.id;
            this.renderer.addClass(this.el.nativeElement, name || 'dropzone');
            this.model.events = {
                mouse: this.renderer.listen(this.el.nativeElement, 'mousemove', (e) => this.checkState(e)),
                touch: this.renderer.listen(this.el.nativeElement, 'touchmove', (e) => this.checkState(e))
            };
        } else {
            if (this.model.hovering) {
                this.event.emit({ type: 'drop', id: this.model.hovering });
                this.model.hovering = null;
            }
            this.renderer.removeClass(this.el.nativeElement, name || 'dropzone');
            this.renderer.removeClass(this.el.nativeElement, `${name || 'dropzone'}-above`);
            this.renderer.removeClass(this.el.nativeElement, `${name || 'dropzone'}-below`);
            this.renderer.removeClass(this.el.nativeElement, `${name || 'dropzone'}-hover`);
            if (this.model.events) {
                for (const key in this.model.events) {
                    if (this.model.events.hasOwnProperty(key)) {
                        this.model.events[key] ? this.model.events[key]() : null;
                    }
                }
                this.model.events = null;
            }
        }
    }

    public clear(e) {
        this.model.hovering = null;
        this.checkState(e);
    }

    private checkState(event: any) {
        if (this.timers.check) {
            clearTimeout(this.timers.check);
            this.timers.check = null;
        }
        if (!this.timers.update_box) {
            this.model.box = this.el.nativeElement.getBoundingClientRect();
            this.timers.update_box = setTimeout(() => this.timers.update_box = null, 1000);
        }
        this.timers.check = setTimeout(() => {
            const center = event.center ? event.center : { x: event.clientX || event.touches[0].clientX, y: event.clientY || event.touches[0].clientY };
            this.renderer.removeClass(this.el.nativeElement, `${name || 'dropzone'}-above`);
            this.renderer.removeClass(this.el.nativeElement, `${name || 'dropzone'}-below`);
            this.renderer.removeClass(this.el.nativeElement, `${name || 'dropzone'}-hover`);
            if (center.x >= this.model.box.left && center.x <= this.model.box.left + this.model.box.width &&
                center.y >= this.model.box.top && center.y <= this.model.box.top + this.model.box.height) {
                this.model.hovering = this.model.item_id || true;
                this.renderer.addClass(this.el.nativeElement, `${name || 'dropzone'}-hover`);
                this.state = this.model.hovering ? (center.y < this.model.box.top + this.model.box.height / 2 ? 'above' : 'below') : '';
                if (this.state) {
                    this.renderer.addClass(this.el.nativeElement, `${name || 'dropzone'}-${this.state}`);
                }
                this.stateChange.emit(this.state);
            }
            this.timers.check = null;
        }, 15);
    }
}
