
import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';

import { OverlayContainerComponent } from '../components/overlays/overlay-container/overlay-container.component';
import { ModalComponent } from '../components/overlays/modal/modal.component';
import { NotificationComponent } from '../components/overlays/notification/notification.component';
import { TooltipComponent } from '../components/overlays/tooltip/tooltip.component';

import { WIDGETS } from '../settings';
import { DynamicBaseComponent } from '../components/overlays/dynamic-base.component';
import { DraggedItemOverlayComponent } from '../components/overlays/dragged-item/dragged-item.component';

@Injectable({
    providedIn: 'root'
})
export class OverlayService {
    public static instance = null;
    private cmp_reg: { [name: string]: any } = {};
    private cmp_list: { [name: string]: any } = {};
    private containers: { [name: string]: any } = {};
    private container_services: { [name: string]: any } = {};
    private default_vc: ViewContainerRef = null;
    private _view: ViewContainerRef = null;

    constructor(private _cfr: ComponentFactoryResolver, private injector: Injector) {
        OverlayService.instance = this;
        this.loadView();
    }

    /**
     * Sets the view to attach the notification display, usually the root component
     * @param view View Container to attach the notifications display
     */
    set view(view: ViewContainerRef) {
        if (view) {
            this._view = view;
            if (this.containers && this.containers['root']) {
                this.clearContainer();
            }
            this.renderRootContainer();
        }
    }

    /**
     * Attempts to load the root view container
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
            setTimeout(() => this.loadView(tries), 500);
        }
    }

    /**
     * Define a component that can be rendered on the overlay
     * @param id ID of the component
     * @param type Component Type
     * @param data Initial data to pass to the component
     */
    public setup(id: string, cmp: Type<any>, data?: { [name: string]: any }) {
        this.register(id, cmp, data);
    }

    /**
     * Defines a modal that can be rendered on the overlay
     * @param id ID of the modal
     * @param data Initial data to pass to the modal
     */
    public setupModal(id: string, data?: { [name: string]: any }) {
        this.register(id, ModalComponent, data);
    }

    /**
     * Defines a tooltip that can be rendered on the overlay
     * @param id ID of the tooltip
     * @param data Initial data to pass to the tooltip
     */
    public setupTooltip(id: string, data?: { [name: string]: any }) {
        this.register(id, TooltipComponent, data);
    }

    /**
     * Register a component that can be rendered on the overlay
     * @param id ID of the component
     * @param type Component Type
     * @param data Initial data to pass to the component
     */
    public register(id: string, cmp: Type<any>, data?: { [name: string]: any }) {
        WIDGETS.log('OVERLAY(S)', `Registering overlay ${id} with component:`, cmp.name);
        this.cmp_reg[id] = data;
    }

    /**
     * Function to register a component attached to an overlay
     * @param id ID of the component
     * @param type Component Type
     */
    public registerComponent(id: string, cmp: Type<any>) {
        WIDGETS.log('OVERLAY(S)', `Registering component ${cmp.name} with ${id}`);
        this.cmp_list[id] = cmp;
    }

    /**
     * Open predefined modal with the given data
     * @param id ID of the component
     * @param next Callback for events on the modal
     * @param data Initial data to pass to the component
     * @return Promise of an observable for events on the open modal
     */
    public openModal(id: string, data?: { [name: string]: any }, next?: (event: any) => void, cntr: string = 'root') {
        return this.add(cntr || 'root', id, ModalComponent, data, next);
    }

    /**
     * Open predefined modal with the given data
     * @param id ID of the component
     * @param data Initial data to pass to the component
     * @param action Callback for events on the notification
     * @return Promise of an observable for events on the notification
     */
    public notify(id: string, data?: { [name: string]: any }, action?: () => void, cntr: string = 'root') {
        return NotificationComponent.notify(id, data, action, cntr);
    }

    /**
     * Open predefined tooltip with the given data
     * @param id ID of the component
     * @param data Initial data to pass to the component
     * @return Promise of an observable for events on the tooltip
     */
    public openTooltip(id: string, data?: { [name: string]: any }) {
        return this.add('root', id, TooltipComponent, data);
    }

    /**
     * Create/Open component on the overlay
     * @param c_id ID of the container to render the component
     * @param id ID of the component
     * @param type Component Type
     * @param data Initial data to pass to the component
     * @return Promise of instance of the created component
     */
    public add(c_id: string = 'root', id: string, cmp: Type<any> | string, data?: { [name: string]: any }, next?: (value: any) => void) {
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
        return new Promise<DynamicBaseComponent>((resolve, reject) => {
            const container = c_id ? this.containers[c_id] : (this.containers.root ? this.containers.root : null);
            if (container) {
                container.add(id, cmp).then((inst: DynamicBaseComponent) => {
                    // let's inject @Inputs to component instance
                    inst.id = id;
                    // inst.parent = this;
                    inst.container = c_id || 'root';
                    inst.set(data);
                        // Subscribe to events if there is a callback
                    if (next && inst.subscribe instanceof Function) {
                        inst.subscribe(next);
                    }
                        // Resolve the instance of component
                    resolve(inst);
                }, (err) => reject(err));
            } else {
                reject();
            }
        });
    }

    /**
     * Removes the component with the given id from the container
     * @param c_id ID of the container
     * @param id ID of the component
     */
    public remove(c_id: string = 'root', id: string) {
        if (c_id && this.containers[c_id]) {
            this.containers[c_id].remove(id);
        }
    }

    /**
     * Updates the model of the component with the given ID on the container
     * @param c_id ID of the container. Defaults to root
     * @param id ID of the component
     * @param data New data to pass to the component
     */
    public set(c_id: string = 'root', id: string, data: { [name: string]: any }) {
        if (c_id && this.containers[c_id]) {
            this.containers[c_id].get(id).set(data);
        }
    }

    /**
     * Get the component instance with the given id from the container
     * @param c_id ID of the container. Defaults to root
     * @param id ID of the component
     * @returns Component with the given ID or null
     */
    public get(c_id: string = 'root', id: string) {
        if (c_id && this.containers[c_id]) {
            return this.containers[c_id].get(id);
        }
        return null;
    }

    /**
     * Listen to events of component on the specified overlay container
     * @param c_id ID of the overlay container
     * @param id ID of the component
     * @param next Callback for emitted event from the component
     */
    public listen(c_id: string = 'root', id: string, next: (event: any) => {}) {
        if (c_id && this.containers[c_id]) {
            return this.containers[c_id].get(id).watch(next);
        }
        return null;
    }

    /**
     * Closes all components in the overlay space
     */
    public clear(id?: string) {
        for (const k in this.containers) {
            if (this.containers.hasOwnProperty(k)) {
                this.containers[k].clear();
            }
        }
    }

    /**
     * Registers an overlay container with the given ID
     * @param id ID of the container
     * @param container Overlay container instance
     */
    public registerContainer(id: string, container: OverlayContainerComponent) {
        this.clearContainer(id);
        this.containers[id] = container;
        this.containers[id].service = this;
    }

    /**
     * Registers the service to inject into overlay components
     * @param service Service instance to inject into components
     * @param id ID of the service. Defaults to global
     */
    public registerService(service: any, id: string = 'global') {
        this.container_services[id] = service;
    }

    /**
     * Gets the specifed service
     * @param id ID of the service to get. Defaults to global
     * @returns Service with the specified ID or null
     */
    public getService(id: string = 'global') {
        if (this.container_services[id]) {
            return this.container_services[id]
        }
        return null;
    }

    /**
     * Clears the overlay container with the given ID
     * @param id ID of the container to clear. Defaults to root
     */
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

    /**
     * Merges the two given objects
     * @param dest Destination object
     * @param src Source object
     * @returns Merged destination object
     */
    private merge(dest: any, src: any) {
        for (const key in src) {
            if (src.hasOwnProperty(key)) {
                dest[key] = src[key];
            }
        }
        return dest;
    }

    /**
     * Creates the root overlay container
     */
    private renderRootContainer() {
        if (!this.containers.root && this._view) {
                // Get factory for component
            const factory = this._cfr.resolveComponentFactory(OverlayContainerComponent);
            if (this.containers.root) {
                this.containers.root.clear();
                this.containers.root.destroy();
            }
                // Create component on view
            const cmp = this._view.createComponent(factory);
            this.containers.root = cmp.instance;
            this.containers.root.ng = cmp;
                // Set service for container
            this.containers.root.service = this;
                // Add notifications layer
            this.add('root', 'ACA_WIDGET_INTERNAL_notifications', NotificationComponent, {}).then(() => null, () => null);
                // Add dragged item layer
            this.add('root', 'ACA_WIDGET_INTERNAL_dragndrop', DraggedItemOverlayComponent, {}).then(() => null, () => null);
            return;
        } else if (!this._view && this.default_vc) {
            this._view = this.default_vc;
            if (this.default_vc) { this.renderRootContainer(); }
        }
    }
}
