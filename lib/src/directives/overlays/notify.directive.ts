
import { Directive, ElementRef, EventEmitter, Input, Output, TemplateRef, Type, OnChanges, SimpleChanges } from '@angular/core';

import { OverlayService } from '../../services/overlay.service';

import { NotificationComponent } from '../../components/overlays/notification/notification.component';

import { WIDGETS } from '../../settings';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[notify]',
})
export class NotifyDirective implements OnChanges {
    @Input() public name = '';
    @Input() public container = 'root';
    @Input() public action = '';
    @Input() public timeout: number;
    @Input() public model: { [name: string]: any } = {};
    @Input() public template: TemplateRef<any> = null;
    @Input() public cmp: Type<any> = null;
    @Input() public show = false;
    @Output() public showChange = new EventEmitter<boolean>();
    @Output() public event: any = new EventEmitter();
    public id = '';
    public sub: Subscription = null;

    private data: { [name: string]: any } = {};

    constructor(private el: ElementRef, private overlay: OverlayService) {
        this.id = `N${Math.floor(Math.random() * 8999999 + 1000000).toString()}`;
    }
    public ngOnDestroy() {
        this.removeNotification();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.show && this.show) {
            this.createNotification();
        } else if (changes.show && !this.show) {
            this.removeNotification();
        }
    }

    private createNotification() {
        this.data = {
            name: this.name,
            show: this.show,
            cmp: this.cmp,
            el: this.el,
            data: this.model,
            timeout: this.timeout,
            action: this.action,
            template: this.template,
            dismiss: () => {
                this.show = false;
                this.showChange.emit(this.show);
            }
        };
        NotificationComponent.notify(this.id, this.data, () => {
            this.event.emit();
        }, this.container);
    }

    private removeNotification() {
        NotificationComponent.dismiss(this.id, this.container);
    }

    private processEvent(event: any) {
        if (event.type === 'close') {
            this.show = false;
            this.showChange.emit(false);
            this.removeNotification();
        }
        return;
    }
}
