import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'; 
import { ComponentResolver, ComponentRef, ReflectiveInjector, ResolvedReflectiveProvider, ViewContainerRef, OnInit, Type } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { FORM_DIRECTIVES } from '@angular/forms';
import { NotificationService } from './notification.service';

const PLACEHOLDER = '-';

@Component({
    selector: 'notification', 
    styles: [ require('./notification.style.scss') ],
    templateUrl: './notification.template.html',
    directives: [ NgTemplateOutlet ]
})
export class Notification implements OnInit {
    @Input() timeout: number = 2000;
    @Input() cssClass: any;
    @Input() canClose: boolean = false;
    @Input() styles: string[] = [];

    @Output() dataChange = new EventEmitter();

    @ViewChild('notification') notify: ElementRef;
    @ViewChild('content') content: ElementRef;

    @ViewChild('notification', { read: ViewContainerRef }) _notify: ViewContainerRef;
    @ViewChild('content', { read: ViewContainerRef }) protected _content: ViewContainerRef;

    id: string;
    bindings: any;
    contents: any[] = [];
    contentRef: ComponentRef<any>[] = [];
    coreStyles: string[] = [
    	require('./notification.style.scss')
    ];
    last_closed: string = '';
    animate_time = 1000;
    animations = [];

    constructor(private _cr: ComponentResolver) {
        this.id = (Math.round(Math.random() * 899999999 + 100000000)).toString();
        this.bindings = ReflectiveInjector.resolve([]);
    }

    ngOnInit() {
    	this.animations = this.createAnimations();
    }

    render(type: Type, viewContainer: ViewContainerRef, bindings: ResolvedReflectiveProvider[]){
        return this._cr.resolveComponent(type)
            .then(cmpFactory => {
                const ctxInjector = viewContainer.parentInjector;
                const childInjector = Array.isArray(bindings) && bindings.length > 0 ?
                    ReflectiveInjector.fromResolvedProviders(bindings, ctxInjector) : ctxInjector;
                return viewContainer.createComponent(cmpFactory, viewContainer.length, childInjector);
            })
            .then((cmpRef: ComponentRef<any>) => {
                this.content.nativeElement.appendChild(cmpRef.location.nativeElement);
                let id = Math.floor(Math.random() * 89999999 + 10000000).toString();
                cmpRef.instance.id = id;
                let fn = () => { cmpRef.instance.state = 'hide'; setTimeout(() => { this.close(id); }, this.animate_time); };
               	cmpRef.instance.close = fn;
                this.contents.push(cmpRef.instance);
                this.contentRef.push(cmpRef);
                this.updatePositions();
                return cmpRef.instance;
            });
    }

    setClose(state: boolean, timeout: number = 2000) {
    	this.canClose = state;
    	this.timeout = timeout;
    }

    createAnimations() {
    	let base = 0.5;
    	let space = 5;
    	let time = this.animate_time/2 + 'ms ease-out';
    	let animates = [
            state('hidden',  style({'opacity':'0'})),
            transition('* => hidden', animate(time, keyframes([
                style({'opacity':'1', offset: 0}), style({'opacity':'0', offset: 1.0})
            ]))),
            transition('hidden => *', animate(time, keyframes([
                style({'opacity':'0', offset: 0}), style({'opacity':'1', offset: 1.0})
            ])))
        ];
        	// Create States
		for(let i = 0; i < 16; i++) {
			let pos = (i * space + base) + 'em';
			animates.push(state(i.toString(),   style({'bottom': pos})));
		}
			// Create Transitions
		for(let i = 0; i < 16; i++) {
			let ipos = (i * space + base) + 'em';
			let i_start = style({'bottom':ipos, offset: 0 });
			for(let k = 0; k < 16; k++) {
				if(i === k) continue;
				let t = i.toString() + ' => ' + k.toString();
				let kpos = (k * space + base) + 'em';
				let k_end = style({'bottom':kpos, offset: 1 });
				animates.push(transition(t,  animate(time, keyframes([i_start, k_end])) ));
			}
		}
    	return animates;
    }

    createContentWithHTML(html, styles?) {
    	let template = `
    		<div @notification="state" @position="pos" [class]="'notification ' + cssClass">
    			${html} ${(this.close ? '<div class="close-btn" *ngIf="canClose" (click)="close()">☓</div>' : '')} 
			</div>`;
    	let styleList = this.coreStyles.concat(styles? styles : []);
    	let time = this.animate_time + 'ms ease-out';
    	let anims = this.animations;
        @Component({
            selector: 'modal-content',
            template: template,
            styles : styleList,
            directives: [ FORM_DIRECTIVES ],
		    animations: [
		        trigger('notification', [
		            state('hide',   style({'right':'-20.0em', 'opacity' : '0'})),
		            state('show', style({'right':'0.5em', 'opacity' : '1' })),
		            transition('* => hide', animate(time, keyframes([
		                style({'right':'0.5em', 'opacity' : '1', offset: 0}), style({'right':'-20.0em', 'opacity' : '0', offset: 1.0})
		            ]))),
		            transition('* => show', animate(time, keyframes([
		                style({'right':'-20.0em', 'opacity' : '0', offset: 0}), style({'right':'0.5em', 'opacity' : '1', offset: 1.0})
		            ])))
		        ]),
		        trigger('position', anims)
		    ]
        })
        class ModalContent {
            data:any = {};
            cssClass:string = 'defaultClass';
            close:Function = () => {};
            canClose: boolean = true;
            state: string = 'show';
            pos: string = '1';
            setData(data: any){
                this.data = data;
            }
            setClass(cssClass: string){
            	console.log(cssClass);
            	if(cssClass && cssClass != '') this.cssClass = cssClass;
            	else this.cssClass = 'defaultClass';
            }
            setClose(canClose: boolean){
            	this.canClose = canClose;
            }
            setPosition(n: string) {
            	this.pos = n;
            }
        }
        return ModalContent;
    }

    updatePositions() {
    	let len = this.contents.length;
    	for(let i = 0; i < len; i++) {
    		if(i < 16) this.contents[(len -1) - i].setPosition((i).toString());
    		else this.contents[(len -1) - i].setPosition('hidden');
    	}
    }

    setOptions(options: any) {
    	if(options.timeout) this.timeout = options.timeout;
    	if(options.cssClass) this.cssClass = options.cssClass;
    	if(options.canClose) this.canClose = options.canClose;
    	if(options.styles) this.styles = options.styles;
    }

    add(msg: string, cssClass: string, options: any) {
    	if(options) this.setOptions(options);
        let cmp = this.createContentWithHTML(msg, this.styles);
        let res = this.render(cmp, this._content, this.bindings);
        if(res) res.then(notify => { 
        	notify.setClass(cssClass);
        	notify.setClose(this.canClose);
	        if(!this.canClose) {
	        	setTimeout(() => {
	        		notify.close();
	        	}, this.timeout + 1000);
	        }
	    });
    }

    close(id: string) {
    	if(this.last_closed === id) return;
    	this.last_closed = id;
    	for(let i = 0; i < this.contents.length; i++) {
    		if(this.contents[i] && this.contents[i].id === id) {
    			if(this.contents[i].id) {
    					// Remove notification from variables and DOM
    				this.contents.splice(i, 1);
                	this.content.nativeElement.removeChild(this.contentRef[i].location.nativeElement);
    				this.contentRef.splice(i, 1);
    				this.updatePositions();
    				break;
				}
    		}
    	}
    }

    clear() {
    	for(let i = 0; i < this.contents.length; i++) {
				// Remove notification from variables and DOM
			this.contents[i].close();
    	}
    }

}
