

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

    /**
     * Add a component to be rendered to the on the overlay container
     * @param id ID of the added component
     * @param cmp Component Class to be rendered on the overlay container
     * @returns Returns the render function promise
     */
    public add(id: string, cmp: Type<any>) {
        if (!this.cmp_refs[id] || !(this.cmp_refs[id].instance instanceof cmp)) {
            return this.render(id, cmp);
        } else {
            return new Promise((rs, rj) => rj('Item with ID and Component Exist'));
        }
    }

    /**
     * Checks if the component with the given ID exists on the overlay container
     * @param id ID of the component to check the existance of
     * @returns Returns whether the component exists or not
     */
    public exists(id: string) {
        return !!(this.cmp_refs[id]);
    }

    /**
     * Removes the component with the given ID from the container
     * @param id ID of the component to remove
     */
    public remove(id: string) {
        setTimeout(() => {
            if (this.cmp_refs[id]) {
                this.cmp_refs[id].destroy();
                this.cmp_refs[id] = null;
            }
        }, 50);
    }

    /**
     * Sets the ID of the overlay container
     * @param id ID to set on the overlay container
     */
    public setID(id: string) {
        this.id = id;
        this.idChange.emit(id);
    }

    /**
     * Removes all the components rendered on the overlay container
     */
    protected clear() {
        for (const id in this.cmp_refs) {
            if (this.cmp_refs.hasOwnProperty(id) && id.indexOf('ACA_WIDGET_INTERNAL_') !== 0) {
                this.remove(id);
            }
        }
    }

    /**
     * Gets the service set for the overlay container
     * @returns Returns the set service or an empty object
     */
    protected getService() {
        return this.service ? this.service.getService() : {};
    }

    /**
     * Renders the specified component on the overlay container
     * @param id ID of the component to render
     * @param type Component Class to render
     * @returns Returns a promise which resolves with the component instance of rejects with the reason of the failure
    */
    protected render(id: string, type: Type<any>, tries: number = 0) {
        return new Promise((resolve, reject) => {
            if (tries > 3 || !type) {
                return reject(!this.content ? 'No view to render to' : `No component to render`);
            }
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
                    inst.service = this.service.getService();
                    inst.uid = `${id}`;
                    setTimeout(() => resolve(inst), 50);
                    this._cdr.markForCheck();
                } else {
                    setTimeout(() => this.render(id, type, tries).then((inst) => resolve(inst), (err) => reject(err)), 200 * ++tries);
                }
            }, 10);
        });
    }
}
