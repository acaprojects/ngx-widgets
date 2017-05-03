/**
* @Author: Alex Sorafumo
* @Date:   18/11/2016 4:31 PM
* @Email:  alex@yuion.net
* @Filename: notification.service.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 27/01/2017 12:24 PM
*/

import { Injectable, ComponentFactoryResolver, ComponentRef, ViewContainerRef, Type } from '@angular/core';
import { ApplicationRef, Injector } from '@angular/core';
import { Notification } from '../components';

@Injectable()
export class NotificationService {

      colors: { fg: string, bg: string } = {
          fg: '#FFF',
          bg: '#123456'
      };
      cmp: any = null;
      cmpRef: ComponentRef<any> = null;
    private default_vc: ViewContainerRef = null;
      private _view: ViewContainerRef = null;
    private tries: number = 0;

    constructor(private _cr: ComponentFactoryResolver, private injector: Injector) {
        this.loadView();
    }

    ngOnInit() {

    }
    /**
     * Sets the view to attach the notification display, usually the root component
     * @param  {ViewContainerRef} view View Container to attach the notifications display
     * @return {void}
     */
    set view(view: ViewContainerRef) {
        if(view){
            this._view = view;
            if(this.cmpRef) {
                this.cmpRef.destroy();
                this.cmp = null;
                this.cmpRef = null;
            }
            this.render(Notification);
        } else {

        }
    }
    /**
     * Attempts to load the root view container
     * @return {void}
     */
    loadView() {
        let app_ref = <ApplicationRef>this.injector.get(ApplicationRef);
        if(app_ref && app_ref['_rootComponents'] && app_ref['_rootComponents'][0] && app_ref['_rootComponents'][0]['_hostElement']){
            this.default_vc = app_ref['_rootComponents'][0]['_hostElement'].vcRef;
            if(this.default_vc) {
                this._view = this.default_vc;
                this.render(Notification);
            }
        } else if(this.tries < 10) {
            this.tries++;
            setTimeout(() => {
                this.loadView();
            }, 500);
        }
    }
    /**
     * Adds a message to the service to display as a notification
     * @param  {string} msg      Message to display, can contain HTML
     * @param  {string} cssClass CSS class to attach to the notification
     * @param  {any}    opts     Data to pass notification component
     * @return {void}
     */
    add(msg:string, cssClass?:string, opts?:any) {
        if(!this.cmp) return -1;
        return this.cmp.add(msg, cssClass ? cssClass : 'default', opts);
    }
    /**
     * Closes a notification with the given id
     * @param  {string} id ID of notification to cloase
     * @return {void}
     */
    close(id:string) {
        if(!this.cmp) return;
        this.cmp.close(id);
    }
    /**
     * Closes all notification being displayed
     * @return {void}
     */
    clear() {
        if(!this.cmp) return;
        setTimeout(() => {
            this.cmp.clear();
        }, 100);
    }

    /**
     * Sets whether or not the notifcations close automatically
     * @param  {boolean}   state Can user close notification
     * @param  {number = 2000} timeout Auto close timeout lenght in ms
     * @return {void}
     */
    canClose(state: boolean, timeout: number = 2000) {
        if(this.cmp) this.cmp.setClose(state, timeout);
    }
    /**
     * Creates the notification display and attaches it to the defined view container
     * @param  {Type<any>} type Component to render
     * @return {void}
     */
    private render(type: Type<any>){
        if(this._view) {
            let factory = this._cr.resolveComponentFactory(type)
            if(this.cmpRef) {
                this.cmpRef.destroy();
            }
            this.cmpRef = this._view.createComponent(factory);

            // let's inject @Inputs to component instance
            this.cmp = this.cmpRef.instance;
        } else if(!this._view) {
            this._view = this.default_vc;
            if(this.default_vc) {
                this.render(type);
            }
        }
    }

}
