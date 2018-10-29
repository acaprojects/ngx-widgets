
import { Component, Input, ViewChild, HostListener, OnChanges, Output, EventEmitter } from '@angular/core';
import { ChangeDetectorRef, ComponentFactoryResolver, ElementRef, ViewContainerRef } from '@angular/core';

import { MapOverlayComponent } from '../map-overlay/map-overlay.component';
import { OverlayContainerComponent } from '../../../overlays/overlay-container/overlay-container.component';
import { WIDGETS } from '../../../../settings';

@Component({
    selector: 'map-overlay-container',
    template: `<div #el class="overlay-container"><div><ng-container #content></ng-container></div></div>`,
    styleUrls: ['./map-overlay-container.styles.scss'],
})
export class MapOverlayContainerComponent extends OverlayContainerComponent implements OnChanges {
    @Input() public src: string;
    @Input() public model: any[] = [];
    @Input() public el: any = null;
    @Input() public state: any = null;
    @Input() public resize: any = null;
    @Output() public event = new EventEmitter();

    @ViewChild('content', { read: ViewContainerRef }) protected content: ViewContainerRef;
    @ViewChild('el') public root: ElementRef;

    @HostListener('window:resize') public windowResize() {
        this.resizeEvent();
    }

    private previous: any[] = [];

    constructor(protected _cfr: ComponentFactoryResolver, protected _cdr: ChangeDetectorRef) {
        super(_cfr, _cdr);
    }

    public ngOnInit() {
        super.ngOnInit();
        if (this.service) {
            this.service.registerContainer(this.id, this);
        }
    }

    public ngOnDestroy() {
        this.clear();
    }

    public ngOnChanges(changes: any) {
        if (changes.model && this.model) {
            if (this.timers.render) {
                clearTimeout(this.timers.render);
            }
            this.timers.render = setTimeout(() => {
                // Remove component that don't exist anymore
                this.updateOverlays();
            }, 100);
        }
        if (changes.state || changes.el) {
            this.resizeEvent();
        }
    }

    private updateOverlays() {
        if (!this.el) {
            return setTimeout(() => this.updateOverlays(), 200);
        }
        // Remove old components and update existing
        if (this.previous) {
            for (const i of this.previous) {
                let found = false;
                for (const item of this.model) {
                    if (i.id === item.id && (i.cmp === item.cmp || i.template === item.template)) {
                        found = true;
                        if (i.inst) {
                            i.inst.set(item);
                            item.inst = i.inst;
                        }
                        break;
                    }
                }
                if (!found) {
                    let name = '';
                    if (typeof i.cmp === 'string') { name = i.cmp; }
                    else { name = i.cmp.name }
                    this.remove(`${i.id}`);
                }
            }
        }
        // Add new components
        for (const item of this.model) {
            if (item.id && !this.exists(`${item.id}`)) {
                let name = '';
                if (typeof item.cmp === 'string') { name = item.cmp; }
                else { name = item.cmp.name }
                if (item.map_id) {
                    const clean_id = item.map_id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
                    item.el = this.el.querySelector(`#${clean_id}`);
                    if (!item.el && !item.coordinates) {
                        this.error(item);
                    }
                }
                this.add(`${item.id}`, MapOverlayComponent).then((inst: any) => {
                    item.inst = inst;
                    inst.set(item);
                    inst.subscribe((event) => {
                        if (event && !(Object.keys(event).length === 0 && event.constructor === Object)) {
                            event.id = item.id;
                            this.event.emit(event);
                        }
                    });
                }, () => { });
            }
        }
        this.previous = this.model;
        setTimeout(() => this.resizeEvent(), 200);
    }

    private resizeEvent() {
        for (const id in this.cmp_refs) {
            if (this.cmp_refs.hasOwnProperty(id) && this.cmp_refs[id]) {
                const item = this.getComponent(id);
                // if (item.map !== this.el) {
                    item.map = this.el;
                    if (this.el && item.map_id) {
                        const clean_id = item.map_id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
                        const el = this.el.querySelector(`#${clean_id}`);
                        if (el) {
                            item.el = el;
                        } else {
                            item.el = null;
                            if (!item.coordinates) {
                                this.error(item);
                            }
                        }
                    }
                // }
                item.map_state = this.state;
                if (item.data) {
                    item.data.map_state = this.state;
                } else {
                    item.data = { map_state: this.state };
                }
                this.cmp_refs[id].instance.set(item);
            }
        }
    }

    private getComponent(id: string) {
        for (const item of this.model) {
            if (`${item.id}` === id) {
                return item;
            }
        }
        return {};
    }

    private error(item: any) {
        if (this.timers.error) {
            clearTimeout(this.timers.error);
        }
        this.timers.error = setTimeout(() => {
            const win = (window as any);
            if (!win.int_map) { win.int_map = { not_found: {} } }
            if (!win.int_map.not_found[this.src]) { win.int_map.not_found[this.src] = []; }
            if (win.int_map.not_found[this.src].indexOf(item.map_id) < 0) {
                WIDGETS.log('MAP', `Unable to grab POI selector "${item.map_id}" as it does not exist on map "${this.src}"`, null, 'warn');
                win.int_map.not_found[this.src].push(item.map_id);
            }
            this.event.emit({ type: 'warning', msg: `Unable to grab POI selector "${item.map_id}" as it does not exist on map "${this.src}"` });
            this.timers.error = null;
        }, 300);
    }
}
