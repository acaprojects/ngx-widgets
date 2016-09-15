import { Injectable, ComponentFactoryResolver, ComponentRef, ViewContainerRef, Type } from '@angular/core';
import { ApplicationRef } from '@angular/core';
import { Notification } from './notification.component';

@Injectable()
export class NotificationService {

  	public defaultVC: ViewContainerRef = null;
  	colors: { fg: string, bg: string } = {
  		fg: '#FFF',
  		bg: '#123456'
  	};
  	cmp: any = null;
  	cmpRef: ComponentRef<any> = null;
  	private vc: ViewContainerRef = null;

	constructor(private _cr: ComponentFactoryResolver, private app: ApplicationRef) {

	}

	ngOnInit() {

	}

	set view(view: ViewContainerRef) {
		this.vc = view;
		this.render(Notification, this.vc);
	}


	add(msg:string, cssClass?:string, opts?:any) {
		if(!this.cmp) return null;
		console.log('Add notification');
		return this.cmp.add(msg, cssClass, opts);
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

    private render(type: Type<any>, vc: ViewContainerRef){
    	if(vc) {
	        let factory = this._cr.resolveComponentFactory(type)
			if(this.cmpRef) {
				this.cmpRef.destroy();
			}
	    	this.cmpRef = this.vc.createComponent(factory);

	        // let's inject @Inputs to component instance
	        this.cmp = this.cmpRef.instance;
        }
    }

}
