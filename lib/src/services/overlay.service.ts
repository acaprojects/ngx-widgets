
import { ComponentRef, Inject, Injectable, Type, ViewContainerRef } from '@angular/core';
import { ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';

import { OverlayContainerComponent } from '../components/overlays/overlay-container/overlay-container.component';
import { ModalComponent } from '../components/overlays/modal/modal.component';
import { NotificationComponent } from '../components/overlays/notification/notification.component';
import { TooltipComponent } from '../components/overlays/tooltip/tooltip.component';

import { WIDGETS } from '../settings';

@Injectable()
export class OverlayService {
    private cmp_reg: any = {};
    private cmp_list: any = {};
    private containers: any = {};
    private container_services: any = {};
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
            if (this.containers && this.containers['root']) {
                this.clearContainer();
            }
            this.renderRootContainer();
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
            this.renderRootContainer();
        } else if (tries < 10) {
            tries++;
            setTimeout(() => {
                this.loadView(tries);
            }, 500);
        }
    }

    /**
     * Function to define a component that can be rendered on the overlay
     * @param  {string} id ID of the component
     * @param  {Type<any>} type Component Type
     * @param  {any} data Initial data to pass to the component
     * @return {void}
     */
    public setup(id: string, cmp: Type<any>, data?: any) {
        this.register(id, cmp, data);
    }

    /**
     * Function to define a modal that can be rendered on the overlay
     * @param  {string} id ID of the modal
     * @param  {any} data Initial data to pass to the modal
     * @return {void}
     */
    public setupModal(id: string, data?: any) {
        this.register(id, ModalComponent, data);
    }

    /**
     * Function to define a tooltip that can be rendered on the overlay
     * @param  {string} id ID of the tooltip
     * @param  {any} data Initial data to pass to the tooltip
     * @return {void}
     */
    public setupTooltip(id: string, data?: any) {
        this.register(id, TooltipComponent, data);
    }

    /**
     * Function to register a component that can be rendered on the overlay
     * @param  {string} id ID of the component
     * @param  {Type<any>} type Component Type
     * @param  {any} data Initial data to pass to the component
     * @return {void}
     */
    public register(id: string, cmp: Type<any>, data?: any) {
        WIDGETS.log('OVERLAY(S)', `Registering overlay ${id} with component:`, cmp.name);
        this.cmp_reg[id] = data;
    }

    /**
     * Function to register a component attached to an overlay
     * @param  {string} id ID of the component
     * @param  {Type<any>} type Component Type
     * @return {void}
     */
    public registerComponent(id: string, cmp: Type<any>) {
        WIDGETS.log('OVERLAY(S)', `Registering component ${cmp.name} with ${id}`);
        this.cmp_list[id] = cmp;
    }

    /**
     * Open predefined modal with the given data
     * @param  {string} id ID of the component
     * @param  {any} data Initial data to pass to the component
     * @return {Promise<Observable>} returns a promise which returns an observable for events on the component
     */
    public openModal(id: string, data?: any) {
        return this.add('root', id, ModalComponent, data);
    }

    /**
     * Open predefined notify popup with the given data
     * @param  {string} id ID of the popup
     * @param  {any} data Initial data to pass to the popup
     * @return {Promise<Observable>} returns a promise which returns an observable for events on the component
     */
    public notify(id: string, data?: any) {
        return this.add('root', id, NotificationComponent, data);
    }

    /**
     * Open predefined tooltip with the given data
     * @param  {string} id ID of the component
     * @param  {any} data Initial data to pass to the component
     * @return {Promise<Observable>} returns a promise which returns an observable for events on the component
     */
    public openTooltip(id: string, data?: any) {
        return this.add('root', id, TooltipComponent, data);
    }


    /**
     * Create/Open component on the overlay
     * @param  {string} c_id ID of the container to render the component
     * @param  {string} id ID of the component
     * @param  {Type<any>} type Component Type
     * @param  {any} data Initial data to pass to the component
     * @return {Promise<Observable>} returns a promise which returns an observable for events on the component
     */
    public add(c_id: string = 'root', id: string, cmp: Type<any> | string, data?: any) {
        for (const item in this.cmp_reg) {
            if (this.cmp_reg.hasOwnProperty(item) && item === id) {
                data = this.merge(this.cmp_reg[item], data);
            }
        }
        if (typeof cmp === 'string') {
            const component = this.cmp_list[cmp];
            if (component) {
                data.cmp_id = cmp;
                cmp = component;
            }
        } else {
            data.cmp_id = cmp.name;
        }
        WIDGETS.log('OVERLAY][S', `Rendering overlay ${id} with component:`, [data.cmp_id, data]);
        return new Promise((resolve, reject) => {
            const container = c_id ? this.containers[c_id] : (this.containers.root ? this.containers.root : null);
            if (container) {
                container.add(id, cmp).then((inst) => {
                    // let's inject @Inputs to component instance
                    inst.id = id;
                    // inst.parent = this;
                    inst.container = c_id || 'root';
                    inst.set(data);
                    resolve(inst);
                }, (err) => reject(err));
            } else {
                reject();
            }
        });
    }

    /**
     * Removes the component with the given id from the container
     * @param  {string} c_id ID of the container
     * @param  {string} id ID of the component
     * @return {void}
     */
    public remove(c_id: string = 'root', id: string) {
        if (c_id && this.containers[c_id]) {
            this.containers[c_id].remove(id);
        }
    }

    /**
     * Updates the model of the component with the given ID on the container
     * @param  {string} c_id ID of the container
     * @param  {string} id ID of the component
     * @param  {any} data New data to pass to the component
     * @return {void}
     */
    public set(c_id: string = 'root', id: string, data: any) {
        if (c_id && this.containers[c_id]) {
            const inst = this.containers[c_id].set(data);
        }
    }

    /**
     * Get the component instance with the given id from the container
     * @param  {string} c_id ID of the container
     * @param  {string} id ID of the component
     * @return {void}
     */
    public get(c_id: string = 'root', id: string) {
        if (c_id && this.containers[c_id]) {
            return this.containers[c_id].get(id);
        }
        return null;
    }

    /**
     * Get the component instance with the given id from the container
     * @param  {string} c_id ID of the container
     * @param  {string} id ID of the component
     * @return {void}
     */
    public listen(c_id: string = 'root', id: string, next: (event: any) => {}) {
        if (c_id && this.containers[c_id]) {
            return this.containers[c_id].get(id).watch(next);
        }
        return null;
    }

    /**
     * Closes all components in the overlay space
     * @return {void}
     */
    public clear(id?: string) {
        for (const k in this.containers) {
            if (this.containers.hasOwnProperty(k)) {
                this.containers[k].clear();
            }
        }
    }

    public registerContainer(id: string, container: any) {
        this.clearContainer(id);
        this.containers[id] = container;
        this.containers[id].service = this;
    }

    public registerService(service: any, id: string = 'global') {
        this.container_services[id] = service;
    }

    public getService(id: string = 'global') {
        if (this.container_services[id]) {
            return this.container_services[id]
        }
        return null;
    }

    public clearContainer(id?: string) {
        if (id && this.containers[id]) {
            this.containers[id].clear();
            // this.containers[id].destroy();
            this.containers[id] = null;
        } else if (!id && this.containers.root) {
            this.containers.root.clear();
            this.containers.root.destroy();
            this.containers.root = null;
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
    /**
     * Render container component on the given view
     * @param  {string}    id   Component ID
     * @param  {Type<any>} type Component Type
     * @return {any} Returns a promise which returns the component instance
     */
    private renderRootContainer() {
        if (this.containers.root) {
            return;
        } else if (this._view) {
            const factory = this._cfr.resolveComponentFactory(OverlayContainerComponent);
            if (this.containers.root) {
                this.containers.root.clear();
                this.containers.root.destroy();
            }

            const cmp = this._view.createComponent(factory);
            this.containers.root = cmp.instance;
            this.containers.root.ng = cmp;
            this.containers.root.service = this;
            return;
        } else if (!this._view && this.default_vc) {
            this._view = this.default_vc;
            if (this.default_vc) {
                this.renderRootContainer();
            }
            return;
        }
    }
}
