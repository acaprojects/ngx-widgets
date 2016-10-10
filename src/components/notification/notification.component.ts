import { Component, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { ComponentRef, ViewContainerRef, ComponentFactoryResolver }  from '@angular/core';
import { AfterViewInit, OnInit, OnDestroy, OnChanges, SimpleChange } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } 	 from '@angular/core';
import { NotifyBlock } from './notify-block.component';

const PLACEHOLDER = '-';

@Component({
    selector: 'notification',
    styleUrls: [ './notification.style.css' ],
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
    @ViewChild('content', { read: ViewContainerRef }) public _content: ViewContainerRef;

    id: string;
    content_instance: any[] = [];
    content_timers: any[] = [];
    contentRef: ComponentRef<any>[] = [];
    data: any = null;
    last_closed: string = '';
    html: string = '';
    component: any = null;

    constructor(
    	private _cfr: ComponentFactoryResolver
    ) {
        this.id = (Math.round(Math.random() * 899999999 + 100000000)).toString();
    }

    ngOnInit() {
    }

    public render(html: string, cssClass: string) {
        let factory = this._cfr.resolveComponentFactory(NotifyBlock);
    	let cmpRef = this._content.createComponent(factory);
    	this.contentRef.push(cmpRef);
        // let's inject @Inputs to component instance
        this.content_instance.push(cmpRef.instance);
        this.contentRef.push(cmpRef);
        cmpRef.instance.entity = this.data ? this.data : {};
        cmpRef.instance.entity.canClose = this.canClose;
        cmpRef.instance.entity.html = html;
        cmpRef.instance.cssClass = cssClass;
        cmpRef.instance.entity.close = () => {
            this.close(cmpRef.instance.id);
        };
        if(!this.canClose) {
            this.content_timers.push(setTimeout(() => {
                cmpRef.instance.position = 'close';
                setTimeout(() => {
                    this.close(cmpRef.instance.id);
                }, 300);
            }, this.timeout));
        }
        this.updatePositions();
        return cmpRef;
    }

    ngOnChanges(changes: any) {
    }

    setClose(state: boolean, timeout: number = 2000) {
    	this.canClose = state;
    	this.timeout = timeout;
        for(let i = 0; i < this.content_timers[i]; i++) {
            if(this.content_timers[i]) clearTimeout(this.content_timers[i]);
        }
        this.content_timers = [];
    	for(let i = 0; i < this.content_instance.length; i++) {
            let inst = this.content_instance[i];
            if(this.canClose) {
                if(!this.canClose) {
                    this.content_timers.push(setTimeout(() => {
                        inst.position = 'close';
                        setTimeout(() => {
                            this.close(inst.id);
                        }, 300);
                    }, this.timeout));
                }
            }
        }
    }

    updatePositions() {
    	let len = this.content_instance.length;
    	for(let i = 0; i < len; i++) {
    		if(i < 16) this.content_instance[(len -1) - i].position = (i).toString();
    		else this.content_instance[(len -1) - i].position = 'hidden';
    	}
    }

    setOptions(options: any) {
    	this.data = options;
    }

    add(msg: string, cssClass: string, options: any) {
    	if(options) this.setOptions(options);
    	let ref = this.render(msg, cssClass);
    }

    close(id: string) {
    	if(this.last_closed === id) return;
    	this.last_closed = id;
    	for(let i = 0; i < this.content_instance.length; i++) {
    		if(this.content_instance[i] && this.content_instance[i].id === id) {
    			if(this.content_instance[i].id) {
                    let id = this.content_instance[i].id;
                    setTimeout(() => {
                        if(this.content_instance[i]) {
                            this.content_instance[i].remove = true;
            					// Remove notification from variables and DOM
            				this.content_instance.splice(i, 1);
                        } else {
                            let el = document.getElementById(id);
                            if(el && el.parentNode) {
                                el.parentNode.removeChild(el);
                            }
                        }
                        let ref = this.contentRef.splice(i, 1)[0];
                        if(ref) ref.destroy();
                        this.updatePositions();
                    }, 500);
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
