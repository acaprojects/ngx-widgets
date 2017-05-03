/**
 * @Author: Alex Sorafumo
 * @Date:   18/11/2016 4:31 PM
 * @Email:  alex@yuion.net
 * @Filename: modal.service.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 27/01/2017 1:14 PM
 */

import { ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { AlertDialog, ConfirmDialog, DateDialog, TimeDialog } from '../components';
import { Modal } from '../components/modal';
import { SimpleModal } from '../components/modal/modals';

import { WIDGETS } from '../settings';

let MODALS: any = {

};

@Injectable()
export class ModalService {

    private modal: any = {};
    private modalRef: any = {};
    private colors: { fg: string, bg: string } = {
        fg: '#FFF',
        bg: '#123456',
    };
    private modal_data: any = {};
    private modal_inputs: any = {};
    private last_modal_id: string = '';
    private default_vc: ViewContainerRef = null;
    private _view: ViewContainerRef = null;
    private tries: number = 0;

    constructor(private _cr: ComponentFactoryResolver, private injector: Injector) {
        this.loadView();
        MODALS = {
            default: Modal,
            simple: SimpleModal,
            alert: AlertDialog,
            confirm: ConfirmDialog,
            date: DateDialog,
            time: TimeDialog,
        };
    }

    /**
     * Sets the view to attach the notification display, usually the root component
     * @param  {ViewContainerRef} view View Container to attach the notifications display
     * @return {void}
     */
     set view(view: ViewContainerRef) {
         if (view) {
             this._view = view;
         } else {
             return;
         }
     }

    /**
     * Attempts to load the root view container
     * @return {void}
     */
     public loadView() {
         const app_ref = this.injector.get(ApplicationRef) as any;
         if (app_ref && app_ref._rootComponents && app_ref._rootComponents[0]
             && app_ref._rootComponents[0]._hostElement) {

             this.default_vc = app_ref._rootComponents[0]._hostElement.vcRef;
             if (this.default_vc) {
                 this._view = this.default_vc;
             }
         } else if (this.tries < 10) {
             this.tries++;
             setTimeout(() => {
                 this.loadView();
             }, 500);
         }
     }
    /**
     * Stores paramters for use when creating a modal with the given id
     * @param  {string} id    Modal ID
     * @param  {any}    input Modal creation parameters
     * @return {void}
     */
     public setup(id: string, input: any) {
         this.modal_inputs[id] = input;
     }

    /**
     * Opens a modal of id with the given or previously stored parameters
     * @param  {string} id    Modal ID, if not set or empty will create random id
     * @param  {any}    input (Optional) Modal Creation parameters
     * @return {string}       Returns the id of the modal
     */
     public open(id: string, input?: any) {
         if (!id || id === '') {
             id = Math.floor(Math.random() * 89999999 + 10000000).toString();
         }
         if (!input) {
             // Check if previous modal data exists
             const info = this.modal_inputs[id];
             if (info && (info.component || info.html)) {
                 if (this.modal[id]) {
                     this.cleanModal(id);
                 }
                 this.modal_data[id] = info;
                 // Create Modal
                 const modal = this.render(id, this.modal_data[id].type);
                 this.last_modal_id = id;
                 return modal.status;
             } else  {
                 WIDGETS.error('Modal(S)]', 'No inputs for modal.');
                 return id;
             }
         }
         if (this.modal[id]) {
             this.cleanModal(id);
         }
         // Get any previously set properties
         if (this.modal_inputs[id]) {
             this.modal_data[id] = this.modal_inputs[id];
         } else {
             this.modal_data[id] = {};
         }
         let modal_type = MODALS[input.type] ? MODALS[input.type] : null;
         if (!modal_type) {
             modal_type = this.modal_data[id].type ? this.modal_data[id].type : MODALS.default;
         }
         // Update parameters
         this.modal_data[id] = {
             // Type of modal. Gets set to an angulur component by service
             type: modal_type,
             // Title of the modal
             title: input.title ? input.title : this.modal_data[id].title,
             // Data to inject in to the modal content
             data: input.data ? input.data : this.modal_data[id].data,
             // Component to inject into the modal
             component: input.component ? input.component : ( input.cmp ? input.cmp : this.modal_data[id].component),
             // Text
             text: input.text ? input.text : this.modal_data[id].text,
             // Default modal size. Can be small or large
             size: input.size ? input.size : this.modal_data[id].size,
             // Styles to be applied to the root element of modal
             styles: input.styles ? input.styles : this.modal_data[id].styles,
             // Buttons for simple modals
             options: input.options ? input.options : this.modal_data[id].options,
             // Basic colours for modal
             colors: input.colors ? input.colors : this.modal_data[id].colors,
             // Width of modal
             width: input.width ? input.width : this.modal_data[id].width,
             // Display modal at top of screen. If not true modal will show up in the middle of the screen
             top: input.top ? input.top : this.modal_data[id].top,
             // Enable closing of modal by clicking top right X or outside
             close: input.close ? input.close : this.modal_data[id].close,
         };
         if (typeof this.modal_data[id].type === 'string') {
             this.modal_data[id].type = MODALS[this.modal_data[id].type] || MODALS.default;
         }
         this.modal_inputs[id] = this.modal_data[id];
         // Create Modal
         const modal = this.render(id, this.modal_inputs[id].type);
         this.last_modal_id = id;
         return modal.status;
     }

    /**
     * Close modal with the given id or all modals
     * @param  {string} id (Optional)Modal ID
     * @return {void}
     */
     public close(id: string) {
         if (id === '' && this.last_modal_id === '') {
             // Close all modals
             const keys = Object.keys(this.modal);
             for (const k of keys) {
                 if (this.modal[k]) {
                     this.modal[id].close();
                     this.cleanModal(id);
                 }
             }
         } else if (id === '' && this.last_modal_id !== '') {
             // Close last modals
             this.modal[id].close();
             this.last_modal_id = '';
         } else if (id && this.modal[id]) {
             // Close selected modal
             this.modal[id].close();
             this.cleanModal(id);
         }
     }
    /**
     * Closes all modal
     * @return {void}
     */
     public clear() {
         const keys = Object.keys(this.modal);
         for (const k of keys) {
             if (this.modal[k]) {
                 this.modal[k].close();
                 this.cleanModal(k);
             }
         }
     }
    /**
     * Cleans up modal after it has been removed.
     * @param  {string} id Modal ID
     * @return {void}
     */
     private cleanModal(id: string) {
         if (this.modalRef[id]) {

             // Destory Modal
             this.modalRef[id].destroy();
         }
         this.modalRef[id] = null;
         this.modal[id] = null;
         this.modal_data[id] = null;
     }
    /**
     * Render modal inside defined view container
     * @param  {string}    id   Modal ID
     * @param  {Type<any>} type Modal Component
     * @return {any} Returns the instance of the modal
     */
     private render(id: string, type: Type<any>) {
         if (this._view && type && typeof type !== 'string') {
             const factory = this._cr.resolveComponentFactory(type);
             if (this.modalRef[id]) {
                 this.modalRef[id].destroy();
             }
             this.modalRef[id] = this._view.createComponent(factory);

             // let's inject @Inputs to component instance
             this.modal[id] = this.modalRef[id].instance;
             this.modal[id].id = id;
             this.modal[id].service = this;
             this.modal[id].setParams(this.modal_data[id]);
             return this.modal[id];
         } else if (!this._view) {
             this._view = this.default_vc;
             if (this.default_vc) {
                 this.render(id, type);
             }
         }
         return { status: null };
     }

 }
