import { Directive, HostListener, Input, TemplateRef, Output, EventEmitter } from "@angular/core";
import { Type } from "@angular/compiler";

import { OverlayService } from "../services/overlay.service";
import { ContextItemComponent } from "../components/overlays/context-item/context-item.component";

@Directive({
    selector: '[context-item]'
})
export class ContextItemDirective {
    @Input() public id: string = `CTX_${Math.floor(Math.random() * 8999999 + 1000000)}`;
    @Input() public cmp: Type;
    @Input() public data: any;
    @Input() public template: TemplateRef<any>;
    @Output() public offset = new EventEmitter();
    @Output() public event = new EventEmitter();

    private model: any = {};

    @HostListener('contextmenu', ['$event']) public contextEvent(event) {
        event.preventDefault();
        if (this.model.instance) {
            this.overlay.remove('root', this.model.instance.id);
            this.model.instance = null;
            return setTimeout(() => this.contextEvent(event), 50);
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
