

import { OverlayService } from '../../../services/overlay.service';
import { ComponentFactoryResolver, Type } from '@angular/core';
import { Component, EventEmitter, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
    selector: 'overlay-container',
    template: `
        <div #el class="overlay-container"><ng-container #content></ng-container></div>
    `,
    styleUrls: ['./overlay-container.styles.scss'],
})
export class OverlayContainerComponent {
    public id = `overlay-container-${Math.floor(Math.random() * 8999999 + 1000000)}`;
    public ng: any = null; // Angular component created from componentFactory
    @Output() public event: any = new EventEmitter();
    @Output() public idChange: any = new EventEmitter();
    protected cmp_refs: any = {};
    protected timers: any = {};

    @ViewChild('content', { read: ViewContainerRef }) protected content: ViewContainerRef;
    @ViewChild('el') public root: ElementRef;

    constructor(protected _cfr: ComponentFactoryResolver, protected service: OverlayService) { }

    public ngOnInit() {
        this.idChange.emit(this.id);
    }

    public add(id: string, cmp: Type<any>) {
        if (!this.cmp_refs[id] || !(this.cmp_refs[id].instance instanceof cmp)) {
            return this.render(id, cmp);
        } else {
            return new Promise((resolve, reject) => {
                reject('Item with ID and Component Exist');
            });
        }
    }

    public exists(id: string) {
        return !!(this.cmp_refs[id]);
    }

    public remove(id: string) {
        setTimeout(() => {
            if (this.cmp_refs[id]) {
                this.cmp_refs[id].destroy();
                this.cmp_refs[id] = null;
            }
        }, 50);
    }

    public setID(id: string) {
        this.id = id;
        this.idChange.emit(id);
    }

    protected clear() {
        for (const id in this.cmp_refs) {
            if (this.cmp_refs.hasOwnProperty(id)) {
                this.remove(id);
            }
        }
    }

    protected render(id: string, type: Type<any>, tries: number = 0) {
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
                    inst.parent = this;
                    inst.uid = `${id}`;
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
