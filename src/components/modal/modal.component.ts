import { Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { ComponentRef, ViewContainerRef, ComponentFactoryResolver }  from '@angular/core';
import { AfterViewInit, OnInit, OnDestroy, OnChanges, SimpleChange } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } 	 from '@angular/core';

import { ModalService, IHaveDynamicData, DynamicTypeBuilder } from '../../services';

const PLACEHOLDER = '-';

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
    @Input() private component: any = null;
    @Input() private htmlContent: string;
    @Input() title: string = 'Modal Title';
    @Input() size: string;
    @Input() data: any;
    @Input() cssClass: string = 'default';
    @Input() close: boolean = true;
    @Input() styles: string[] = [];
    @Input() options: any[] = [];
    @Input() color1: string = ''; // Background Color
    @Input() color2: string = ''; // Foreground Color

    @Output() dataChange = new EventEmitter();
    @Output('open') openEvent = new EventEmitter();
    @Output('close') closeEvent = new EventEmitter();
    @ViewChild('modal') public modal: ElementRef;
    @ViewChild('content', { read: ViewContainerRef }) public _content: ViewContainerRef;

    modal_box: any;
    state: boolean = false;
    state_inner: boolean = false;
    cb_fn: Function = null;
    error: boolean = false;
    err_msg: string = '';
    content_instance: any = null;
    contentRef: ComponentRef<any> = null;
    clean_fn: Function = null;
    cmp: any;
    width: number = 20;
    unit: string = 'em';
    html: string = '';
    large: boolean = false;
    display_width: number = 20;
    display_height: number = 12;

    constructor(
    	public _cfr: ComponentFactoryResolver
    ) {
        this.options.push({ 'text': 'Ok', 'fn': null });
        this.options.push({ 'text': 'Cancel', 'fn': null });
        this.id = (Math.round(Math.random() * 899999999 + 100000000)).toString();
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
            this.display_width = 2.5 * this.width;
            this.display_height = this.display_width / 3 * 2 - 5;
            console.log(this.display_width, this.display_height);
        }
    }

    ngOnDestroy(){
        if (this.contentRef) {
            this.contentRef.destroy();
            this.contentRef = null;
        }
    }

    public blockScroll(e: Event) {
        e.stopPropagation();
        e.preventDefault();
    }

    public buildContents() {
        if(this.component !== undefined && this.component !== null){
    		let factory = this._cfr.resolveComponentFactory(this.component);
            if(factory) this.render(factory);
            else console.log('Unable to find factory for: ', this.component);
    	}
    }

    public renderTemplate(result: { type: any, module: any }) {
      	let componentType = result.type;
      	let runtimeModule = result.module
        /*
      	// Compile module
      	this.compiler
        	.compileModuleAndAllComponentsAsync(runtimeModule)
        	.then((moduleWithFactories) => {
            	//let factory = _.find(moduleWithFactories.componentFactories, { componentType: componentType });
            	// Target will instantiate and inject component (we'll keep reference to it)
            	//this.render(factory);
        	}, (err) => {});
            //*/
    }

    public render(factory: any) {
    	if(this.contentRef) {
    		this.contentRef.destroy();
    	}
    	this.contentRef = this._content.createComponent(factory);

        // let's inject @Inputs to component instance
        this.content_instance = this.contentRef.instance;
        this.content_instance.entity = this.data.data;
        this.content_instance.entity.close = (cb: Function) => { this.close_fn(cb) };

    }

    public onPointer(event: any) {
  		if (event.stopPropagation) event.stopPropagation();
		else event.cancelBubble = true;
        if(!this.close || !this.modal) return;
        let c = {
            x: event.clientX,
            y: event.clientY
        }
        this.modal_box = this.modal.nativeElement.getBoundingClientRect();
        let box = this.modal_box;
        if(c.x < 10 && c.y < 10) this.open();
        if(c.x < box.left || c.y < box.top || c.x > box.left + box.width || c.y > box.top + box.height) {
            this.close_fn();
        }
    }

    public setData(data: any) {
        this.data = data;
    }

    public setParams(data: any) {
        if(data) {
            console.log(data);
	    	this.data = data;
	    	if(this.content_instance) this.content_instance.entity = this.data;
            if(data.title) this.title = data.title;
            if(data.html) this.html = data.html;
            if(data.component) this.component = data.component;
            if(data.size) this.large = data.size === 'large';
            if(data.options) this.options = data.options;
            if(data.styles) this.styles = data.styles;
            if(data.close !== undefined && data.close !== null) this.close = data.close;
            if(data.width !== undefined && data.width !== null) this.width = data.width;
            if(data.unit !== undefined && data.unit !== null) this.unit = data.unit;
            if(data.colors) {
                this.color1 = data.colors.bg;
                this.color2 = data.colors.fg;
            }
        	this.buildContents();
        }
    }

    public setCallback(cb_fn: Function) {
        if(cb_fn) {
            this.cb_fn = cb_fn;
        }
    }

    public close_fn(cb_fn?: Function) {
        this.state = this.state_inner = false;
        setTimeout(() => {
            if(cb_fn) cb_fn();
            if(this.clean_fn) this.clean_fn();
            if(this.service) this.service.cleanModal(this.id);
            if(this.closeEvent) this.closeEvent.emit(null);
        }, 500);
    }

    public open() {
        console.log('Open');
        this.state = true;
        setTimeout(() => { this.state_inner = true; }, 100);
        setTimeout(() => { this.openEvent.emit(null); }, 500);
    }

    set cleanup(clean: Function) {
        this.clean_fn = clean;
    }

    public select(btn: {text:string, fn:Function}) {
        if(this.content_instance) this.data = this.content_instance.entity;
        this.dataChange.emit(this.data);
        let fn = (ok: any, err: any) => {
            if(!err) this.close_fn();
            else {
                this.error = true;
                this.err_msg = err;
            }
        }
        if(btn.fn) {
            btn.fn(this.data, fn);
        } else if(this.cb_fn !== null) {
            this.cb_fn(this.data, fn);
        } else {
            this.close_fn();
        }
    }
}