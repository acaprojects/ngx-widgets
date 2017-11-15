
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ComponentFactoryResolver, Type, ViewContainerRef } from '@angular/core';

import { MapOverlayComponent } from '../map-overlay';
import { OverlayContainerComponent } from '../../overlays';

@Component({
    selector: 'map-overlay-container',
    template: `
        <div #el class="overlay-container">
            <div #content></div>
        </div>`,
    styleUrls: ['./map-overlay-container.styles.css'],
})
export class MapOverlayContainerComponent extends OverlayContainerComponent {
    @Input() public model: any[] = [];
    @Input() public el: any = null;
    @Input() public state: any = null;
    @Input() public resize: any = null;

    public ngOnInit() {
        super.ngOnInit();
        this.service.registerContainer(this.id, this);
    }

    public ngOnDestroy() {
        this.clear();
    }

    public ngOnChanges(changes: any) {
        if (changes.model) {
            this.clear();
            if (this.timers.render) {
                clearTimeout(this.timers.render);
                this.timers.render = null;
            }
            this.timers.render = setTimeout(() => {
                for (const item of this.model) {
                    if (item.id) {
                        let name = '';
                        if (typeof item.cmp === 'string') { name = item.cmp; }
                        else { name = item.cmp.name }
                        const id = `${item.prefix ? item.prefix + '-' : ''}${item.id}`;
                        this.add(id, MapOverlayComponent).then((inst: any) => {
                            inst.set(item);
                            inst.subscribe((event) => {
                                if (event && !(Object.keys(event).length === 0 && event.constructor === Object)) {
                                    event.id = item.id;
                                    this.event.emit(event);
                                }
                            });
                        }, () => {

                        });
                    }
                }
                setTimeout(() => {
                    this.resizeEvent();
                }, 200);
            }, 100);
        }
        if (changes.state || changes.el) {
            this.resizeEvent();
        }
    }

    private resizeEvent() {
        for (const id in this.cmp_refs) {
            if (this.cmp_refs.hasOwnProperty(id) && this.cmp_refs[id]) {
                const item = this.getComponent(id);
                // if (item.map !== this.el) {
                    item.map = this.el;
                    if (this.el && item.id) {
                        const clean_id = item.id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
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
            if (`${item.prefix ? item.prefix + '-' : ''}${item.id}` === id) {
                return item;
            }
        }
        return {};
    }
}
