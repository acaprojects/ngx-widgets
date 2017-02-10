/**
* @Author: Alex Sorafumo
* @Date:   18/11/2016 4:31 PM
* @Email:  alex@yuion.net
* @Filename: modal.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 31/01/2017 9:58 AM
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { ComponentRef, ViewContainerRef, ComponentFactoryResolver }  from '@angular/core';
import { AfterViewInit, OnInit, OnDestroy, OnChanges, SimpleChange } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } 	 from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ModalService, IHaveDynamicData, DynamicTypeBuilder } from '../../services';

const PLACEHOLDER = '-';
const PRIVATE_PARAMS = ['id', 'type', 'service', 'data', 'dataChange', 'openEvent', 'closeEvent', 'modal', '_content', 'ContentRef', 'content_instance', 'render', 'open', 'close']

@Component({
    selector: 'modal',
    styleUrls: [ './modal.style.css', '../material-styles/material-styles.css' ],
    templateUrl: './modal.template.html',
    animations: [
        trigger('backdrop', [
            state('hide',   style({'opacity' : '0'})),
            state('show', style({'opacity' : '1' })),
            transition('* => hide', animate('0.5s ease-out')),
            transition('* => show', animate('0.5s ease-in'))
        ]),
        trigger('space', [
            state('hide',   style({ 'left': '100%', 'opacity' : '0'})),
            state('show', style({ 'left':   '50%', 'opacity' : '1' })),
            transition('* => hide', animate('0.2s ease-out')),
            transition('* => show', animate('0.2s ease-in'))
        ])
    ]
})
export class Modal implements OnInit, OnChanges, OnDestroy {
    @Input() id: string = '';
    @Input() service: any = null;
    @Input() component: any = null;
    @Input() title: string = 'Modal Title';
    @Input() size: string;
    @Input() data: any;
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


    constructor(public _cfr: ComponentFactoryResolver) {
        this.id = (Math.round(Math.random() * 899999999 + 100000000)).toString();
        this.state_obs = new Observable((observer: any) => {
            this.obs = observer;
        });
        this.open();
    }

    ngOnInit() {
    }

    ngAfterContentInit(){
        if(this.modal) {
        	this.buildContents();
            this.modal_box = this.modal.nativeElement.getBoundingClientRect();
        }
    }

    ngOnChanges(changes: any) {
        if(changes.width) {
            this.updateWidth();
        }
        if(changes.top) {
            this.display_top = (this.top && this.top > 0 ? this.top : '') + this.unit;
        }
    }

    updateWidth() {
        this.display_width = this.width;
        this.display_height = this.display_width / 3 * 2 - 5;
    }

    ngOnDestroy(){
        if (this.contentRef) {
            this.contentRef.destroy();
            this.contentRef = null;
        }
        if(this.obs) this.obs.complete();
    }
    /**
     * Resolves the factory for building the content component
     * @return {void}
     */
    public buildContents() {
        if(this.component !== undefined && this.component !== null){
    		let factory = this._cfr.resolveComponentFactory(this.component);
            if(factory) this.render(factory);
            else console.error('[WIDGETS][Modal(C)] Unable to find factory for: ', this.component);
    	}
    }
    /**
     * Creates the component and attaches it to the modal
     * @param {any} factory Anular 2 Component factory
     */
    public render(factory: any) {
    	if(this.contentRef) {
    		this.contentRef.destroy();
    	}
    	this.contentRef = this._content.createComponent(factory);

        // let's inject @Inputs to component instance
        this.content_instance = this.contentRef.instance;
        this.content_instance.entity = this.data.data;
        if(!this.content_instance.entity) this.content_instance.entity = {};
        this.content_instance.entity.close = (cb: Function) => { this.select('close', 'Component') };
        this.content_instance.entity.select = (option: string) => { this.select(option) };
        if(this.content_instance.init) this.content_instance.init();

    }

    public onPointer(event: any) {
  		if (event.stopPropagation) event.stopPropagation();
		else event.cancelBubble = true;
        if(!this.close || !this.modal) return;
        let c: { x: number, y: number } = event.center ? event.center : { x: event.clientX, y: event.clientY };
        this.modal_box = this.modal.nativeElement.getBoundingClientRect();
        let box = this.modal_box;
        if(c.x < 10 && c.y < 10) this.open();
        if(c.x < box.left || c.y < box.top || c.x > box.left + box.width || c.y > box.top + box.height) {
            this.select('close', 'External Click');
        }
    }

    public setData(data: any) {
        this.data = data;
    }

    public setParams(data: any) {
        if(data) {
            let keys = Object.keys(data);
            for(let i = 0; i < keys.length; i++) {
                if(PRIVATE_PARAMS.indexOf(keys[i]) < 0 && keys[i] in this && data[keys[i]] !== undefined && data[keys[i]] !== null) {
                    this[keys[i]] = data[keys[i]];
                }
            }
            if(!this.data) this.data = {};
    	    this.data = (<any>Object).assign(this.data, data);
	    	if(this.content_instance) this.content_instance.entity = this.data;
            if(data.width !== undefined && data.width !== null) {
                this.width = data.width;
                this.updateWidth();
            }
            if(data.top !== undefined && data.top !== null) {
                setTimeout(() => {
                    this.display_top = (this.top && this.top > 0 ? this.top : '') + this.unit;
                    this.modal.nativeElement.style.top = this.display_top;
                }, 100);
            }
        	this.buildContents();
        }
    }

    public open() {
        this.state = true;
        setTimeout(() => { this.state_inner = true; }, 100);
        setTimeout(() => { this.openEvent.emit(); }, 500);
    }

    public close() {
        this.state = this.state_inner = false;
        setTimeout(() => {
            if(this.clean_fn) this.clean_fn();
            if(this.service) this.service.cleanModal(this.id);
            if(this.closeEvent) this.closeEvent.emit();
        }, 500);
    }

    set cleanup(clean: Function) {
        this.clean_fn = clean;
    }

    get status() {
        return this.state_obs;
    }

    public select(type: string, location:string = 'Button') {
        if(this.content_instance) this.data = this.content_instance.entity;
        this.dataChange.emit(this.data);
        if(this.obs){
            this.obs.next({
                type: type,
                location: location,
                data: this.data,
                update: (form: any) => { this.setParams({ form: form }) },
                close: () => { this.close() }
            });
        } else {
            this.close();
        }
    }
}
