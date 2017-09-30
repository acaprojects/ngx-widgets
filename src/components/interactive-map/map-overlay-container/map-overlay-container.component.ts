
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ComponentFactoryResolver, Type, ViewContainerRef } from '@angular/core';
import { MapOverlayComponent } from '../map-overlay';

@Component({
    selector: 'map-overlay-container',
    template: '<div class="overlay-container"><div #content></div></div>',
    styleUrls: ['./map-overlay-container.styles.css'],
})
export class MapOverlayContainerComponent {
    @Input() public model: any[] = [];
    @Input() public el: any = null;
    @Input() public state: any = null;
    @Input() public resize: any = null;
    @Output() public event: any = new EventEmitter();
    private cmp_refs: any = {};

    @ViewChild('content', { read: ViewContainerRef }) private content: ViewContainerRef;

    constructor(private _cfr: ComponentFactoryResolver) {

    }

    public ngOnChanges(changes: any) {
        if (changes.model) {
            this.clear();
            console.log(this.model);
            setTimeout(() => {
                for (const item of this.model) {
                    if (item.id) {
                        this.add(item.id, MapOverlayComponent).then((inst: any) => {
                            item.map = this.el;
                            if (this.el) {
                                const clean_id = item.id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
                                const el = this.el.querySelector(`#${clean_id}`);
                                if (el) { item.el = el; }
                                else { item.el = null; }
                            }
                            item.map_state = this.state;
                            if (item.data) {
                                item.data.map_state = this.state;
                            } else {
                                item.data = { map_state: this.state };
                            }
                            inst.set(item);
                            inst.subscribe((event) => {
                                event.id = item.id;
                                this.event.emit(event);
                            });
                        }, () => {

                        });
                    }
                }
            }, 100);
        }
        if (changes.state) {
            this.resizeEvent();
        }
    }

    public add(id: string, cmp: Type<any>) {
        return this.render(id, cmp);
    }

    public remove(id: string) {
        setTimeout(() => {
            if (this.cmp_refs[id]) {
                this.cmp_refs[id].destroy();
                this.cmp_refs[id] = null;
            }
        }, 50);
    }

    private clear() {
        for (const id in this.cmp_refs) {
            if (this.cmp_refs.hasOwnProperty(id)) {
                this.remove(id);
            }
        }
    }

    private resizeEvent() {
        for (const id in this.cmp_refs) {
            if (this.cmp_refs.hasOwnProperty(id)) {
                const item = this.getComponent(id);
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
            if (item.id === id) {
                return item;
            }
        }
        return {};
    }

    private render(id: string, type: Type<any>, tries: number = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.content && type) {
                    const factory = this._cfr.resolveComponentFactory(type);
                    if (this.cmp_refs[id]) {
                        this.cmp_refs[id].destroy();
                    }
                    const cmp = this.content.createComponent(factory);
                    this.cmp_refs[id] = cmp;
                    const inst: any = cmp.instance;
                    setTimeout(() => {
                        resolve(inst);
                    }, 50);
                } else {
                    if (tries < 10) {
                        setTimeout(() => {
                            this.render(id, type, ++tries).then((inst) => resolve(inst), () => reject());
                        }, 200);
                    } else {
                        reject();
                    }
                }
            }, 10);
        });
    }
}
