
import { ComponentRef, Inject, Injectable, Type, ViewContainerRef } from '@angular/core';
import { ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';

import { OverlayContainerComponent } from '../components';
import { ModalComponent, NotificationComponent, TooltipComponent } from '../components';

@Injectable()
export class OverlayService {

    private cmp_inst: any = {};
    private cmp_reg: any = {};
    private container: any = null;
    private default_vc: ViewContainerRef = null;
    private _view: ViewContainerRef = null;

    constructor(private _cfr: ComponentFactoryResolver,
        private injector: Injector) {
        this.loadView();
    }
    /**
     * Sets the view to attach the notification display, usually the root component
     * @param  {ViewContainerRef} view View Container to attach the notifications display
     * @return {void}
     */
    set view(view: ViewContainerRef) {
        if (view) {
            this._view = view;
            if (this.container) {
                this.clearContainer();
            }
            this.renderContainer();
        } else {
            return;
        }
    }

    /**
     * Attempts to load the root view container
     * @return {void}
     */
    public loadView(tries: number = 0) {
        const app_ref = this.injector.get(ApplicationRef) as any;
        if (app_ref && app_ref._rootComponents && app_ref._rootComponents[0]
            && app_ref._rootComponents[0]._hostElement) {

            this.default_vc = app_ref._rootComponents[0]._hostElement.vcRef;
            if (this.default_vc) {
                this._view = this.default_vc;
            }
            this.renderContainer();
        } else if (tries < 10) {
            tries++;
            setTimeout(() => {
                this.loadView(tries);
            }, 500);
        }
    }

    public setup(id: string, cmp: Type<any>, data?: any) {
        this.register(id, cmp, data);
    }

    public setupModal(id: string, data?: any) {
        this.register(id, ModalComponent, data);
    }

    public setupTooltip(id: string, data?: any) {
        this.register(id, TooltipComponent, data);
    }

    public register(id: string, cmp: Type<any>, data?: any) {
        this.cmp_reg[id] = data;
    }

    public openModal(id: string, data?: any) {
        return this.add(id, ModalComponent, data);
    }

    public notify(id: string, data?: any) {
        return this.add(id, NotificationComponent, data);
    }

    public openTooltip(id: string, data?: any) {
        return this.add(id, TooltipComponent, data);
    }

    public add(id: string, cmp: Type<any>, data?: any) {
        for (const item in this.cmp_reg) {
            if (this.cmp_reg.hasOwnProperty(item) && item === id) {
                data = this.merge(this.cmp_reg[item], data);
            }
        }
        return this.render(id, cmp, data);
    }

    public remove(id: string) {
        if (this.container) {
            this.container.instance.remove(id);
            this.cmp_inst[id] = null;
        }
    }

    public set(id: string, data: any) {
        if (this.cmp_inst[id] &&
            this.cmp_inst[id].set) {
            this.cmp_inst[id].set(data);
        }
    }

    /**
     * Closes all components in the overlay space
     * @return {void}
     */
    public clear() {
        for (const id in this.cmp_inst) {
            if (this.cmp_inst.hasOwnProperty(id)) {
                this.remove(id);
            }
        }
    }
    private merge(obj: any, src: any) {
        for (const key in src) {
            if (src.hasOwnProperty(key)) {
                obj[key] = src[key];
            }
        }
        return obj;
    }

    private clearContainer() {
        for (const id in this.cmp_inst) {
            if (this.cmp_inst.hasOwnProperty(id)) {
                this.remove(id);
            }
        }
        this.container.destroy();
        this.container = null;
    }
    /**
     * Render container component on the given view
     * @param  {string}    id   Component ID
     * @param  {Type<any>} type Component Type
     * @return {any} Returns a promise which returns the component instance
     */
    private renderContainer() {
        if (this.container) {
            return;
        } else if (this._view) {
            const factory = this._cfr.resolveComponentFactory(OverlayContainerComponent);
            if (this.container) {
                this.container.destroy();
            }

            const cmp = this._view.createComponent(factory);
            this.container = cmp;
            return;
        } else if (!this._view && this.default_vc) {
            this._view = this.default_vc;
            if (this.default_vc) {
                this.renderContainer();
            }
            return;
        }
    }
    /**
     * Render component inside container's view
     * @param  {string}    id   Component ID
     * @param  {Type<any>} type Component Type
     * @return {any} Returns a promise which returns the component instance
     */
    private render(id: string, type: Type<any>, data?: any) {
        return new Promise((resolve, reject) => {
            if (this.container) {
                this.container.instance.add(id, type).then((inst) => {
                    // let's inject @Inputs to component instance
                    inst.id = id;
                    inst.parent = this;
                    inst.set(data);
                    this.cmp_inst[id] = inst;
                    resolve(inst);
                }, () => {
                    reject();
                });
            } else {
                reject();
            }
        });
    }
}
