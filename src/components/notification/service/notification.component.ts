import { Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { ComponentRef, ViewContainerRef, ComponentFactoryResolver }  from '@angular/core';
import { AfterViewInit, OnInit, OnDestroy, OnChanges, SimpleChange } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } 	 from '@angular/core';
import { RuntimeCompiler }                                       	 from "@angular/compiler";
import * as _ from 'lodash';

import { IHaveDynamicData, DynamicTypeBuilder } from '../../dynamic/type.builder';

const PLACEHOLDER = '-';

@Component({
    selector: 'notification', 
    styles: [ require('./notification.style.scss') ],
    templateUrl: './notification.template.html'
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
    content_instance: any[] = [];
    contentRef: ComponentRef<any>[] = [];
    coreStyles: string[] = [ require('./notification.style.scss') ];
    data: any = null;
    last_closed: string = '';
    animate_time = 1000;
    animations = [];
    html: string = '';
    component: any = null;

    constructor(
    	private _cfr: ComponentFactoryResolver,
        protected typeBuilder: DynamicTypeBuilder,
        protected compiler: RuntimeCompiler
    ) {
        this.id = (Math.round(Math.random() * 899999999 + 100000000)).toString();
    }

    ngOnInit() {
    	this.animations = this.createAnimations();
    }

    protected addContents(html: string, cmp?: any) {
    	if(html && html !== '') {
    		let template = this.typeBuilder.createComponentAndModule(html);
    		return this.renderTemplate(template);
    	} else if(cmp){
    		let factory = this._cfr.resolveComponentFactory(cmp);
    		return new Promise((resolve, reject) => {
    			resolve(this.render(factory));
    		});
    	}
    }

    protected renderTemplate(result: { type: any, module: any }) {
      	let componentType = result.type;
      	let runtimeModule = result.module

      	// Compile module
      	return this.compiler
        	.compileModuleAndAllComponentsAsync(runtimeModule)
        	.then((moduleWithFactories) => {
            	let factory = _.find(moduleWithFactories.componentFactories, { componentType: componentType });
            	// Target will instantiate and inject component (we'll keep reference to it)
            	return this.render(factory);
        	});
    }

    protected render(factory: any) {
    	let cmpRef = this._content.createComponent(factory);
    	this.contentRef.push(cmpRef);

        // let's inject @Inputs to component instance
        this.content_instance.push(cmpRef.instance); 
        this.content_instance[this.content_instance.length-1].entity = this.data;
        return cmpRef;
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

    updatePositions() {
    	let len = this.content_instance.length;
    	for(let i = 0; i < len; i++) {
    		if(i < 16) this.content_instance[(len -1) - i].setPosition((i).toString());
    		else this.content_instance[(len -1) - i].setPosition('hidden');
    	}
    }

    setOptions(options: any) {
    	this.data = options;
    }

    add(msg: string, cssClass: string, options: any) {
    	if(options) this.setOptions(options);
    	let ref = this.addContents(msg);
    	if(ref) {
    		ref.then(cmpRef => {
    			let inst: any = cmpRef.instance;
    			if(inst.el) {
	    			inst.el.nativeElement.classList.add(cssClass);
	    		}
    		})
    	}
    }

    close(id: string) {
    	if(this.last_closed === id) return;
    	this.last_closed = id;
    	for(let i = 0; i < this.content_instance.length; i++) {
    		if(this.content_instance[i] && this.content_instance[i].id === id) {
    			if(this.content_instance[i].id) {
    					// Remove notification from variables and DOM
    				this.content_instance.splice(i, 1);
    				let ref = this.contentRef.splice(i, 1)[0];
    				ref.destroy();
    				this.updatePositions();
    				break;
				}
    		}
    	}
    }

    clear() {
    	for(let i = 0; i < this.content_instance.length; i++) {
				// Remove notification from variables and DOM
			this.close(this.content_instance[i].id);
    	}
    }

}
