import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'; 
import { ComponentResolver, ComponentRef, ReflectiveInjector, ResolvedReflectiveProvider, ViewContainerRef, OnInit, Type } from '@angular/core';
import { NgTemplateOutlet, FORM_DIRECTIVES } from '@angular/common';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { ModalService } from './modal.service';

const PLACEHOLDER = '-';

@Component({
    selector: '[modal]', 
    styles: [ require('./modal.style.scss') ],
    templateUrl: './modal.template.html',
    directives: [ NgTemplateOutlet ],
    animations: [
        trigger('backdrop', [
            state('hide',   style({'opacity' : '0'})),
            state('show', style({'opacity' : '1' })),
            transition('* => hide', animate('0.5s ease-out', keyframes([
                style({'bac' : '1', offset: 0}), style({'opacity' : '0', offset: 1.0})
            ]))),
            transition('* => show', animate('0.5s ease-in', keyframes([
                style({'opacity' : '0', offset: 0}), style({'opacity' : '1', offset: 1.0})
            ])))
        ]),
        trigger('space', [
            state('hide',   style({ 'left': '100%', 'opacity' : '0'})),
            state('show', style({ 'left':   '50%', 'opacity' : '1' })),
            transition('* => hide', animate('0.5s ease-out', keyframes([
                style({'left': '50%', 'opacity' : '1', offset: 0}), style({'left': '100%', 'opacity' : '0', offset: 1.0})
            ]))),
            transition('* => show', animate('0.5s ease-in', keyframes([
                style({'left': '100%', 'opacity' : '0', offset: 0}), style({'left': '50%', 'opacity' : '1', offset: 1.0})
            ])))
        ])
    ]
})
export class Modal implements OnInit {
    @Input() private src: string;
    @Input() private htmlContent: string;
    @Input() title: string = 'Modal Title';
    @Input() size: string;
    @Input() data: any;
    @Input() cssClass: any;
    @Input() close: boolean = true;
    @Input() styles: string[] = [];
    @Input() options: Object[] = [
        { text: 'Ok', fn: null },
        { text: 'Cancel', fn: null }
    ];
    @Input() color1: string = ''; // Background Color
    @Input() color2: string = ''; // Foreground Color

    @Output() dataChange = new EventEmitter();
    @Output('open') openEvent = new EventEmitter();
    @Output('close') closeEvent = new EventEmitter();

    @ViewChild('modal') modal: ElementRef;
    @ViewChild('content') content: ElementRef;

    @ViewChild('modal', { read: ViewContainerRef }) _modal: ViewContainerRef;
    @ViewChild('content', { read: ViewContainerRef }) protected _content: ViewContainerRef;

    id: string;
    modal_box: any;
    state: string = 'show';
    cb_fn: Function = null;
    error: boolean = false;
    err_msg: string = '';
    bindings: any[] = [];
    directives: any[] = [];
    content_instance: any = null;
    contentRef: ComponentRef<any> = null;
    clean_fn: Function = null;
    cmp: any;

    constructor(private _cr: ComponentResolver) {
        this.id = (Math.round(Math.random() * 899999999 + 100000000)).toString();
        this.bindings = ReflectiveInjector.resolve([
        ]);
    }

    ngOnInit() {
        if(this.src) {
            let dynamicComponent = this.createContentWithTemplate(this.src, this.styles);
            this.render(dynamicComponent, this._modal, this.bindings);
        } else if(this.htmlContent) {
            let dynamicComponent = this.createContentWithHTML(this.htmlContent, this.styles);
            this.render(dynamicComponent, this._modal, this.bindings);
        } else if(this.cmp) {
            this.render(this.cmp, this._modal, this.bindings);
        }
    }

    render(type: Type, viewContainer: ViewContainerRef, bindings: ResolvedReflectiveProvider[]){
        if(this.content_instance) {
            this.cleanContents(() => {
                this.render(type, viewContainer, bindings);
            });
            return null;
        }
        return this._cr.resolveComponent(type)
            .then(cmpFactory => {
                const ctxInjector = viewContainer.parentInjector;
                const childInjector = Array.isArray(bindings) && bindings.length > 0 ?
                    ReflectiveInjector.fromResolvedProviders(bindings, ctxInjector) : ctxInjector;
                return viewContainer.createComponent(cmpFactory, viewContainer.length, childInjector);
            })
            .then((cmpRef: ComponentRef<any>) => {
                this.content.nativeElement.appendChild(cmpRef.location.nativeElement);
                this.content_instance = cmpRef.instance;
                this.contentRef = cmpRef;
                cmpRef.instance.data = this.data;
            });
    }

    cleanContents(finish: Function) {
        this.content.nativeElement.removeChild(this.contentRef.location.nativeElement);
        this.content_instance = null;
        //if(this.contentRef.destory) this.contentRef.destory();
        this.contentRef = null;
        finish();
    }

    createContentWithTemplate(templateUrl, styles?, bindings?) {
    	let directives = [ FORM_DIRECTIVES, ...(this.directives) ];
        @Component({
            selector: 'modal-content',
            templateUrl: templateUrl,
            styles : (styles? styles : []),
            directives: directives,
        })
        class ModalContent {
            data:any = {};
            setData(data:any){
                this.data = data;
            }
        }
        return ModalContent;
    }

    createContentWithHTML(html, styles?, bindings?) {
    	let directives = [ FORM_DIRECTIVES, ...(this.directives) ];
        @Component({
            selector: 'modal-content',
            template: html,
            styles : (styles? styles : []),
            directives: directives,
        })
        class ModalContent {
            data:any = {};
            setData(data:any){
                this.data = data;
            }
        }
        return ModalContent;
    }

    ngOnViewInit(){
        if(this.modal) {
            this.modal_box = this.modal.nativeElement.getBoundingClientRect();
        }
    }

    onPointer(event) {
        if(!this.close) return;
        let c = {
            x: event.clientX,
            y: event.clientY
        }
        if(!this.modal_box) {
            this.modal_box = this.modal.nativeElement.getBoundingClientRect();
        }
        let box = this.modal_box;
        if(c.x < 10 && c.y < 10) this.open();
        if(c.x < box.left || c.y < box.top || c.x > box.left + box.width || c.y > box.top + box.height) {
            console.log('Click outside modal.');
            this.close_fn();
        }
    }

    set template(templateUrl) {
        this.src = templateUrl;
        let dynamicComponent = this.createContentWithTemplate(this.src);
        this.render(dynamicComponent, this._modal, this.bindings);
    }

    set component(cmp) {
        this.cmp = cmp;
        this.render(cmp, this._modal, this.bindings);
    }

    set html(html) {
        this.htmlContent = html;
        let dynamicComponent = this.createContentWithHTML(this.htmlContent);
        this.render(dynamicComponent, this._modal, this.bindings);
    }

    setData(data: any) {
        this.data = data;
    }

    setParams(data: any) {
        if(data) {
            if(data.src) this.template = data.src;
            if(data.title) this.title = data.title;
            if(data.html) this.html = data.html;
            if(data.size) this.size = data.size;
            if(data.options) this.options = data.options;
            if(data.styles) this.styles = data.styles;
            if(data.close !== undefined && data.close !== null) this.close = data.close;
            if(data.bindings !== undefined && data.bindings !== null) this.bindings = data.bindings;
            if(data.directives !== undefined && data.directives !== null) this.directives = data.directives;
            if(data.data) {
                this.data = data.data;
                if(this.content_instance) this.content_instance.setData(this.data);
            }
            if(data.colors) {
                this.color1 = data.colors.bg;
                this.color2 = data.colors.fg;
            }
        }
    }

    setCallback(cb_fn: Function) {
        if(cb_fn) {
            this.cb_fn = cb_fn;
        }
    }

    close_fn(cb_fn?: Function) {
        console.log('Closing Modal.');
        this.state = 'hide';
        setTimeout(() => { 
            if(cb_fn) cb_fn();
            if(this.clean_fn) this.clean_fn();
            this.closeEvent.emit(null); 
        }, 500);
    }

    open() {
        this.state = 'show';
        setTimeout(() => { this.openEvent.emit(null); }, 500);
    }

    set cleanup(clean: Function) {
        this.clean_fn = clean;
    }

    select(btn: {text:string, fn:Function}) {
        if(this.content_instance) this.data = this.content_instance.data;
        this.dataChange.emit(this.data);
        let fn = (ok, err) => { 
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
