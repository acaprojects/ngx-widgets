/**
* @Author: Stephen von Takack
* @Date:   21/09/2016 9:26 AM
* @Email:  steve@acaprojects.com
* @Filename: drop-target.directive.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 15/12/2016 11:35 AM
*/

import { ElementRef, Input } from '@angular/core';
import { Directive, OnInit, OnDestroy } from '@angular/core';
import { DropService } from '../services';

@Directive({
    selector: '[drop-target]',
    // If added as a provider then a new instance is created for every DropTarget
    // this is not desirable and as drop service should be available application wide
    // it should be added to the initial bootstrap
    //providers: [DropService],
})
export class DropTarget implements OnInit, OnDestroy {
	@Input('drop-target')   dropTarget: 	string; 					// defaults to self, otherwise you can define a valid querySelector
	@Input('drop-indicate') dropIndicate: 	string = 'drop-indicate'; 	// defines the hover class to apply, defaults to: drop-indicate
	@Input('drop-stream')   dropStream: 	string; 					// name of the stream the files should be sent to

    private _element: any;
    private _unreg: () => void;


    constructor(elementRef: ElementRef, private _dropService: DropService) {
        this._element = elementRef.nativeElement;
    }


    // Register the element you want to recieve drop events
    ngOnInit() {
        if (this.dropTarget) {
            this._element = document.querySelector(this.dropTarget);
        }

        this._unreg = this._dropService.register(this.dropStream, this._element, this._doHighlight.bind(this));
    }

    ngOnChanges(changes: any){
    	setTimeout(() => {
	    	if(changes.dropTarget && this.dropTarget) {
	    			// Change the drop target
	    		this._unreg();
	            this._element = document.querySelector(this.dropTarget);
	       		this._unreg = this._dropService.register(this.dropStream, this._element, this._doHighlight.bind(this));
	        	this._doHighlight(false);
	    	}
	    	if(changes.dropStream) {
	    			// Change the drop stream
	    		this._unreg();
	       		this._unreg = this._dropService.register(this.dropStream, this._element, this._doHighlight.bind(this));
	    	}
    	}, 20);
    }

    // Ensure all the bindings and classes are removed
    ngOnDestroy() {
        this._unreg();

        // In case the drop-target is another element (not the ElementRef)
        this._doHighlight(false);
    }


    // Applies the hover class to the element
    private _doHighlight(state: boolean) {
        if (state) {
            this._element.classList.add(this.dropIndicate);
        } else {
            this._element.classList.remove(this.dropIndicate);
        }
    }
}
