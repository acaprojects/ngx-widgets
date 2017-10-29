
import { ComponentFactoryResolver, Type } from '@angular/core';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'overlay-container',
    template: `
        <div class="overlay-container"><ng-container #content></ng-container></div>
    `,
    styleUrls: ['./overlay-container.styles.css'],
})
export class OverlayContainerComponent {
    private cmp_refs: any = {};

    @ViewChild('content', { read: ViewContainerRef }) private content: ViewContainerRef;

    constructor(private _cfr: ComponentFactoryResolver) {

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
