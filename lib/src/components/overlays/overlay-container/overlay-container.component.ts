

import { OverlayService } from '../../../services/overlay.service';
import { ComponentFactoryResolver, Type } from '@angular/core';
import { Component, EventEmitter, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'overlay-container',
    template: `
        <div #el class="overlay-container"><ng-container #content></ng-container></div>
    `,
    styleUrls: ['./overlay-container.styles.scss'],
})
export class OverlayContainerComponent {
    public id: string = `overlay-container-${Math.floor(Math.random() * 8999999 + 1000000)}`;
    public ng: any = null; // Angular component created from componentFactory
    public service: OverlayService;
    @Output() public event: any = new EventEmitter();
    @Output() public idChange: any = new EventEmitter();
    protected cmp_refs: any = {};
    protected timers: any = {};

    @ViewChild('content', { read: ViewContainerRef }) protected content: ViewContainerRef;
    @ViewChild('el') public root: ElementRef;

    constructor(protected _cfr: ComponentFactoryResolver, protected _cdr: ChangeDetectorRef) { }

    public ngOnInit() {
        this.idChange.emit(this.id);
    }

    public add(id: string, cmp: Type<any>) {
        console.log(`Adding ${id} of type:`, cmp.name);
        if (!this.cmp_refs[id] || !(this.cmp_refs[id].instance instanceof cmp)) {
            console.log(`Rendering component for ${id}`);
            return this.render(id, cmp);
        } else {
            console.log(`Item with ID and Component exists`);
            return new Promise((resolve, reject) => {
                reject('Item with ID and Component Exist')
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
            if (tries > 10) {
                console.log(!this.content ? 'No view to render to' : `No component to render`);
                return reject(!this.content ? 'No view to render to' : `No component to render`);
            }
            setTimeout(() => {
                console.log(`Rendering ${(type as any).className || type.name} to container ${this.id}`);
                if (this.content && type) {
                    const factory = this._cfr.resolveComponentFactory(type);
                    if (this.cmp_refs[id]) {
                        this.cmp_refs[id].destroy();
                    }
                    const cmp = this.content.createComponent(factory);
                    this.cmp_refs[id] = cmp;
                    const inst: any = cmp.instance;
                    inst.parent = this;
                    inst.service = this.service.getService();
                    inst.uid = `${id}`;
                    setTimeout(() => resolve(inst), 50);
                    console.log(`Rendered ${(type as any).className || type} to container ${this.id}`);
                    this._cdr.markForCheck();
                } else {
                    console.log(`No content view or type for rendering.`, this.content);
                    setTimeout(() => {
                        this.render(id, type, ++tries).then((inst) => resolve(inst), (err) => reject(err));
                    }, 200);
                }
            }, 10);
        });
    }
}
