/**
 * @Author: Alex Sorafumo
 * @Date:   18/11/2016 4:31 PM
 * @Email:  alex@yuion.net
 * @Filename: modal.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 31/01/2017 9:58 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { ComponentFactoryResolver, ComponentRef, ViewContainerRef }  from '@angular/core';
import { AfterViewInit, OnChanges, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger }      from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { DynamicTypeBuilder, IHaveDynamicData, ModalService } from '../../services';

const PLACEHOLDER = '-';
const PRIVATE_PARAMS = ['id', 'type', 'service', 'data', 'dataChange', 'openEvent', 'closeEvent', 'modal', '_content', 'ContentRef', 'content_instance', 'render', 'open', 'close'];

@Component({
    selector: 'modal',
    styleUrls: [ './modal.style.css', '../material-styles/material-styles.css' ],
    templateUrl: './modal.template.html',
    animations: [
        trigger('backdrop', [
            state('hide', style({ opacity : 0 })),
            state('show', style({ opacity : 1 })),
            transition('* <=> *', animate('0.5s ease-out')),
        ]),
        trigger('space', [
            state('hide', style({ transform: 'translate(-50%, -50%) scale(0)'})),
            state('show', style({ transform: 'translate(-50%, -50%) scale(1.0)'})),
            transition('* <=> *', animate('0.2s ease-out')),
            transition('void => *', animate('0.2s ease-out')),
        ]),
    ],
})
export class Modal implements OnInit, OnChanges, OnDestroy {
    @Input() id: string = '';
    @Input() service: any = null;
    @Input() component: any = null;
    @Input() title: string = 'Modal Title';
    @Input() size: string;
    @Input() data: any;
    @Input() options: any;
    @Input() cssClass: string = 'default';
    @Input() canClose: boolean = true;
    @Input() styles: string[] = [];

    @Output() dataChange = new EventEmitter();
    @Output('open') openEvent = new EventEmitter();
    @Output('close') closeEvent = new EventEmitter();
    @ViewChild('modal') public modal: ElementRef;
    @ViewChild('content', { read: ViewContainerRef }) public _content: ViewContainerRef;

    modal_box: any;
    state: boolean = false;
    state_inner: boolean = false;
    error: boolean = false;
    err_msg: string = '';
    width: number = 20;
    top: number = 0;
    unit: string = 'em';
    html: string = '';
    large: boolean = false;
    display_top: string = '50%';
    display_width: number = 20;
    display_height: number = 12;
    protected clean_fn: Function = null;
    protected content_instance: any = null;
    protected contentRef: ComponentRef<any> = null;
    protected state_obs: any = null;
    protected obs: any = null;

    constructor(private _cfr: ComponentFactoryResolver, private renderer: Renderer2) {
        this.id = (Math.round(Math.random() * 899999999 + 100000000)).toString();
        this.state_obs = new Observable((observer: any) => {
            this.obs = observer;
        });

    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        if (this.modal) {
            this.buildContents();
            this.modal_box = this.modal.nativeElement.getBoundingClientRect();
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.state = false;
            this.state_inner = false;
            this.open();
        }, 200);
    }

    ngOnChanges(changes: any) {
        if (changes.width) {
            this.updateWidth();
        }
        if (changes.top) {
            this.display_top = (this.top && this.top > 0 ? this.top : '') + this.unit;
        }
    }
    /**
     * Updates the width of the modal
     */
    updateWidth() {
        this.display_width = this.width;
        this.display_height = this.display_width / 3 * 2 - 5;
    }

    ngOnDestroy() {
        if (this.contentRef) {
            this.contentRef.destroy();
            this.contentRef = null;
        }
        if (this.obs) this.obs.complete();
    }
    /**
     * Resolves the factory for building the content component
     * @return {void}
     */
    public buildContents() {
        if (!this._cfr) {
            return setTimeout(() => {
                this.buildContents();
            }, 200);
        }
        if (this.component !== undefined && this.component !== null) {
            const factory = this._cfr.resolveComponentFactory(this.component);
            if (factory) this.render(factory);
            else console.error('[WIDGETS][Modal(C)] Unable to find factory for: ', this.component);
        }
    }
    /**
     * Creates the component and attaches it to the modal
     * @param  {any} factory Anular 2 Component factory
     * @return {void}
     */
    public render(factory: any) {
        if (this.contentRef) {
            this.contentRef.destroy();
        }
        this.contentRef = this._content.createComponent(factory);

        // let's inject @Inputs to component instance
        this.content_instance = this.contentRef.instance;
        this.content_instance.entity = this.data.data;
        if (!this.content_instance.entity) this.content_instance.entity = {};
        this.content_instance.entity.close = (cb: Function) => { this.event('close', 'Component'); };
        this.content_instance.entity.select = (option: string) => { this.select(option); };
        if (this.content_instance.init) this.content_instance.init();

    }
    /**
     * Called when the the window is tapped
     * @param {any} event Input event
     * @return {void}
     */
    public tapped(event: any) {
          if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
          if (!this.close || !this.modal) return;
          const c: { x: number, y: number } = event.center ? event.center : { x: event.clientX, y: event.clientY };
          this.modal_box = this.modal.nativeElement.getBoundingClientRect();
          const box = this.modal_box;
          if (c.x < 10 && c.y < 10) this.open();
            // User clicked outside modal close the modal
          if (c.x < box.left || c.y < box.top || c.x > box.left + box.width || c.y > box.top + box.height) {
            this.event('close', 'External Click');
        }
    }
    /**
     * Sets the modal data
     * @param {any} data New modal data
     * @return {void}
     */
    public setData(data: any) {
        this.data = data;
        if ('data' in this.data && this.content_instance) {
            this.content_instance.entity = this.data.data;
        }
    }
    /**
     * Sets the parameters for the modal
     * @param {any} data New parameter data
     * @return {void}
     */
    public setParams(data: any) {
        if (!this.modal) {
            setTimeout(() => {
                this.setParams(data);
            }, 200);
            return;
        }
        if (data) {
                // Iterate through data and add it to the modal
            for (const key in data) {
                if (PRIVATE_PARAMS.indexOf(key) < 0 && data[key] !== undefined && data[key] !== null) {
                    this[key] = data[key];
                }
            }
            if (!this.data) this.data = {};
            this.data = (Object as any).assign(this.data, data);
            if (this.content_instance) this.content_instance.entity = this.data;
            if (data.width !== undefined && data.width !== null) {
                this.width = data.width;
                this.updateWidth();
            }
            if (data.top !== undefined && data.top !== null) {
                setTimeout(() => {
                    this.display_top = (this.top && this.top > 0 ? this.top : '') + this.unit;
                    const mdl = this.modal.nativeElement;
                    if (mdl) this.renderer.setStyle(mdl, 'top', this.display_top);
                }, 200);
            }
            this.buildContents();
        }
    }
    /**
     * Called when the modal is opened
     * @return {void}
     */
    public open() {
        this.state = true;
        setTimeout(() => { this.state_inner = true; }, 100);
        setTimeout(() => { this.openEvent.emit(); }, 500);
    }
    /**
     * Closes the modal
     * @return {void}
     */
    public close() {
        this.state = this.state_inner = false;
        setTimeout(() => {
            if (this.clean_fn) this.clean_fn();
            if (this.service) this.service.cleanModal(this.id);
            if (this.closeEvent) this.closeEvent.emit();
        }, 500);
    }
    /**
     * Sets a function to be called when the modal is closing
     * @param  {Function} clean Cleanup function
     * @return {void}
     */
    set cleanup(clean: Function) {
        this.clean_fn = clean;
    }
    /**
     * Get an Observable that posts event that occur within the modal
     * @return {void}
     */
    get status() {
        return this.state_obs;
    }
    /**
     * Posts a button click/tap event
     * @param  {string} type Type of button
     * @return {void}
     */
    public select(type: string) {
        this.event(type, 'Button');
    }
    /**
     * Posts an event to the Observable.
     * @param  {string}    type Type of event that has occured
     * @param  {string =    'Code'}    location Location that the event has come from
     * @return {void}
     */
    public event(type: string, location: string = 'Code') {
        if (this.content_instance) this.data = this.content_instance.entity;
        this.dataChange.emit(this.data);
        if (this.obs) {
            this.obs.next({
                type,
                location,
                data: this.data,
                update: (form: any) => { this.setParams({ form }); },
                close: () => { this.close(); },
            });
        } else {
            this.close();
        }
    }
}
