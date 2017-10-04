
import { Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, Output, Type } from '@angular/core';

import { OverlayService } from '../../services/overlay.service';

import { NotificationComponent } from '../../components';

import { WIDGETS } from '../../settings';

@Directive({
    selector: '[notify]',
})
export class NotifyDirective {
    @Input() public name: string = '';
    @Input() public type: string = '';
    @Input() public model: any = {};
    @Input() public html: string = '';
    @Input() public cmp: Type<any> = null;
    @Input() public show: boolean = false;
    @Output() public showChange: any = new EventEmitter();
    @Output() public event: any = new EventEmitter();
    public id: string = '';
    public sub: any = null;

    private data: any = {};

    constructor(private el: ElementRef, private overlay: OverlayService) {
        this.id = `N${Math.floor(Math.random() * 8999999 + 1000000).toString()}`;
    }
    public ngOnDestroy() {
        this.removeNotification();
    }

    public ngOnChanges(changes: any) {
        if (changes.show && this.show) {
            this.createNotification();
        } else if (changes.show && !this.show) {
            this.removeNotification();
        }
    }

    private createNotification() {
        if (this.sub) {
            this.removeNotification();
            setTimeout(() => {
                this.createNotification();
            }, 100);
            return;
        }
        this.data = {
            name: this.name,
            show: this.show,
            cmp: this.cmp,
            el: this.el,
            data: this.model,
        };
        this.overlay.add(this.id, NotificationComponent, this.data).then((cmp: any) => {
            this.sub = cmp.watch((event) => {
                this.processEvent(event);
            });
        }, () => {
            WIDGETS.error('Notify(D)', 'Failed to create notification');
        });
    }

    private removeNotification() {
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
        this.overlay.remove(this.id);
    }

    private processEvent(event: any) {
        // console.log('Tooltip Event', event);
        if (event.type === 'close') {
            this.show = false;
            this.showChange.emit(false);
            this.removeNotification();
        }
        return;
    }
}
