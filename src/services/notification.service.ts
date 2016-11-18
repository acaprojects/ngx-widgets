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
	add(msg:string, cssClass?:string, opts?:any) {
		if(!this.cmp) return null;
		return this.cmp.add(msg, cssClass ? cssClass : 'default', opts);
	}

	close(id:string) {
		if(!this.cmp) return null;
		return this.cmp.close(id);
	}

	clear() {
		if(!this.cmp) return null;
		setTimeout(() => {
			this.cmp.clear();
		}, 100);
		return 0
	}

    canClose(state: boolean, timeout: number = 2000) {
    	if(this.cmp) this.cmp.setClose(state, timeout);
    }

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
