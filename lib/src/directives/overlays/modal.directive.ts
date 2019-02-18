
import { Directive, ElementRef, EventEmitter, Input, Output, TemplateRef, Type, OnChanges, SimpleChanges } from '@angular/core';

import { OverlayService } from '../../services/overlay.service';

import { ModalComponent } from '../../components/overlays/modal/modal.component';

import { WIDGETS } from '../../settings';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[modal]',
})
export class ModalDirective implements OnChanges {
    @Input() public name = '';
    @Input() public container = 'root';
    @Input() public cmp: Type<any> = null;
    @Input() public model: { [name: string]: any } = {};
    @Input() public template: TemplateRef<any> = null;
    @Input() public show = false;
    @Output() public showChange = new EventEmitter<boolean>();
    @Output() public event = new EventEmitter();
    public id = '';
    public sub: Subscription = null;

    private data: { [name: string]: any } = {};

    constructor(private el: ElementRef, private overlay: OverlayService) {
        this.id = `M${Math.floor(Math.random() * 8999999 + 1000000).toString()}`;
    }

    public ngOnDestroy() {
        this.removeModal();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.show && this.show) {
            this.createModal();
        } else if (changes.show && !this.show) {
            this.removeModal();
        }
    }

    private createModal() {
        if (this.sub) {
            this.removeModal();
            setTimeout(() => {
                this.createModal();
            }, 100);
            return;
        }
        this.data = {
            name: this.name,
            show: this.show,
            cmp: this.cmp,
            el: this.el,
            data: this.model,
            template: this.template,
        };
        this.overlay.add(this.container, this.id, ModalComponent, this.data).then((cmp: any) => {
            this.sub = cmp.watch((event) => {
                this.processEvent(event);
            });
        }, () => {
            WIDGETS.error('Modal][D', 'Failed to create modal');
        });
    }

    private removeModal() {
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
        this.overlay.remove(this.container, `${this.id}`);
    }

    private processEvent(event: any) {
        if (event.type === 'close') {
            this.show = false;
            this.showChange.emit(false);
            this.removeModal();
        } else {
            this.event.emit(event);
        }
        return;
    }
}
