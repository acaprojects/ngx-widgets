
import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, Output, TemplateRef, Type } from '@angular/core';

import { OverlayService } from '../../services/overlay.service';

import { TooltipComponent } from '../../components';
import { WIDGETS } from '../../settings';

@Directive({
    selector: '[tooltip]',
})
export class TooltipDirective {
    @Input() public name: string = '';
    @Input() public container: string = 'root';
    @Input() public position: string = 'bottom'; // top, bottom, left, right
    @Input() public offset: string = 'middle'; // start, middle, end
    @Input() public offsetBy: string = '';
    @Input() public cmp: Type<any> = null;
    @Input() public template: TemplateRef<any> = null;
    @Input() public model: any = {};
    @Input() public triangle: boolean = true;
    @Input() public show: boolean = false;
    @Input() public autoclose: any = true;
    @Input() public hover: boolean = false;
    @Output() public showChange: any = new EventEmitter();
    @Output() public event: any = new EventEmitter();

    public id: string = '';
    public sub: any = null;

    private data: any = {};
    private instance: any;

    @HostListener('mouseenter', ['$event.target']) public onEnter(btn) {
        if (this.hover) {
            this.createTooltip();
        }
    }

    @HostListener('mouseleave', ['$event.target']) public onLeave(btn) {
        if (this.hover) {
            this.removeTooltip();
        }
    }


    constructor(private el: ElementRef, private overlay: OverlayService) {
        this.id = `T${Math.floor(Math.random() * 8999999 + 1000000).toString()}`;
    }

    public ngOnDestroy() {
        this.removeTooltip();
    }

    public ngOnChanges(changes: any) {
        if (changes.show && this.show) {
            this.createTooltip();
        } else if (changes.show && !this.show) {
            this.removeTooltip();
        }
        if (changes.model || changes.template || changes.position || changes.offset || changes.name) {
            this.update();
        }
        if (changes.hover) {
            this.removeTooltip();
        }
    }

    private update() {
        setTimeout(() => {
            if (this.instance) {
                this.data = {
                    name: this.name,
                    position: this.position,
                    offset: this.offset,
                    offsetBy: this.offsetBy,
                    triangle: this.triangle,
                    template: this.template,
                    hover: this.hover,
                    show: this.show,
                    cmp: this.cmp,
                    el: this.el,
                    data: this.model,
                };
                this.instance.set(this.data);
            }
        }, 50);
    }

    private createTooltip() {
        if (this.sub) {
            this.removeTooltip();
            setTimeout(() => {
                this.createTooltip();
            }, 100);
            return;
        }
        this.data = {
            name: this.name,
            position: this.position,
            offset: this.offset,
            offsetBy: this.offsetBy,
            triangle: this.triangle,
            template: this.template,
            hover: this.hover,
            show: this.show,
            cmp: this.cmp,
            el: this.el,
            data: this.model,
        };
        this.overlay.add(this.container, this.id, TooltipComponent, this.data).then((cmp: any) => {
            this.instance = cmp;
            this.sub = cmp.watch((event) => {
                this.processEvent(event);
            });
        }, () => {
            WIDGETS.error('Tooltip][D', 'Failed to create tooltip');
        });
    }

    private removeTooltip() {
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
        this.overlay.remove(this.container, this.id);
    }

    private processEvent(event: any) {
        if (event.type === 'Close' && this.autoclose !== undefined) {
            this.show = false;
            this.showChange.emit(false);
            this.removeTooltip();
        } else {
            this.event.emit(event);
        }
        return;
    }
}
