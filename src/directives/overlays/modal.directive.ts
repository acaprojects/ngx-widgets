
import { Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, Output, TemplateRef, Type } from '@angular/core';

import { OverlayService } from '../../services/overlay.service';

import { ModalComponent } from '../../components';

import { WIDGETS } from '../../settings';

@Directive({
    selector: '[modal]',
})
export class ModalDirective {
    @Input() public name: string = '';
    @Input() public container: string = 'root';
    @Input() public cmp: Type<any> = null;
    @Input() public model: any = {};
    @Input() public template: TemplateRef<any> = null;
    @Input() public show: boolean = false;
    @Output() public showChange: any = new EventEmitter();
    @Output() public event: any = new EventEmitter();
    public id: string = '';
    public sub: any = null;

    private data: any = {};

    constructor(private el: ElementRef, private overlay: OverlayService) {
        this.id = `M${Math.floor(Math.random() * 8999999 + 1000000).toString()}`;
    }

    public ngOnDestroy() {
        this.removeModal();
    }

    public ngOnChanges(changes: any) {
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
