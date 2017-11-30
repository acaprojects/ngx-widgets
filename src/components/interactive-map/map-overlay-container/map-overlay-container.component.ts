
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ComponentFactoryResolver, Type, ViewContainerRef } from '@angular/core';

import { MapOverlayComponent } from '../map-overlay';
import { OverlayContainerComponent } from '../../overlays';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';
import { WIDGETS } from '../../../settings';

@Component({
    selector: 'map-overlay-container',
    template: `
        <div #el class="overlay-container">
            <ng-container #content></ng-container>
        </div>`,
    styleUrls: ['./map-overlay-container.styles.css'],
})
export class MapOverlayContainerComponent extends OverlayContainerComponent {
    @Input() public model: any[] = [];
    @Input() public el: any = null;
    @Input() public state: any = null;
    @Input() public resize: any = null;

    private previous: any[] = [];

    public ngOnInit() {
        super.ngOnInit();
        this.service.registerContainer(this.id, this);
    }

    public ngOnDestroy() {
        this.clear();
    }

    public ngOnChanges(changes: any) {
        if (changes.model && this.model) {
            if (this.timers.render) {
                clearTimeout(this.timers.render);
                this.timers.render = null;
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
            setTimeout(() => {
                this.updateOverlays();
            }, 200);
            return;
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
                const clean_id = item.map_id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
                item.el = this.el.querySelector(`#${clean_id}`);
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
        setTimeout(() => {
            this.resizeEvent();
        }, 200);
    }

    private resizeEvent() {
        for (const id in this.cmp_refs) {
            if (this.cmp_refs.hasOwnProperty(id) && this.cmp_refs[id]) {
                const item = this.getComponent(id);
                // if (item.map !== this.el) {
                    item.map = this.el;
                    if (this.el && item.id) {
                        const clean_id = item.map_id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
                        const el = this.el.querySelector(`#${clean_id}`);
                        if (el) { item.el = el; }
                        else { item.el = null; }
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
}
