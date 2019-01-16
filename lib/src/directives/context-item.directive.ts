import { Directive, HostListener, Input, TemplateRef, Type, Output, EventEmitter } from "@angular/core";

import { OverlayService } from "../services/overlay.service";
import { ContextItemComponent } from "../components/overlays/context-item/context-item.component";

@Directive({
    selector: '[context-item]'
})
export class ContextItemDirective {
    @Input() public id: string = `CTX_${Math.floor(Math.random() * 8999999 + 1000000)}`;
    @Input() public cmp: Type<any>;
    @Input() public data: any;
    @Input() public touch: boolean = false;
    @Input() public template: TemplateRef<any>;
    @Output() public offset = new EventEmitter();
    @Output() public event = new EventEmitter();

    private model: any = {};

    @HostListener('contextmenu', ['$event']) public contextEvent(event) {
        this.open(event)
    }

    @HostListener('touchrelease', ['$event']) public touchEvent(event) {
        if (this.touch) { this.open(event) }
    }

    public open(event) {
        event.preventDefault();
        if (this.model.instance) {
            this.overlay.remove('root', this.model.instance.id);
            this.model.instance = null;
            return setTimeout(() => this.open(event), 50);
        }
        const h = window.innerHeight;
        const w = window.innerWidth;
        const offset = {
            top: event.clientY,
            left: event.clientX,
            right:  w - event.clientX,
            bottom: h - event.clientY
        };
        const data = {
            offset,
            data: this.data
        };
        this.overlay.add('root', `context_${this.id}`, ContextItemComponent, {
            cmp: this.cmp,
            template: this.template,
            data
        }, (e) => {
            this.event.emit(e);
        }).then((inst) => this.model.instance = inst, () => null);
    }

    constructor(private overlay: OverlayService) {

    }
}
