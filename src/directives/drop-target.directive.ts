/**
* @Author: Stephen von Takack
* @Date:   21/09/2016 9:26 AM
* @Email:  steve@acaprojects.com
* @Filename: drop-target.directive.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 15/12/2016 11:35 AM
*/

import { ElementRef, Input, Renderer } from '@angular/core';
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
    @Input('drop-target')   target:     string;     // defaults to self, otherwise you can define a valid querySelector
    @Input() indicate:     string = 'drop-indicate';     // defines the hover class to apply, defaults to: drop-indicate
    @Input() stream:     string;                     // name of the stream the files should be sent to

    private _element: any;
    static listeners: any = {};
    static _ref_cnt: number = 0;
    private _unreg: () => void;


    constructor(elementRef: ElementRef, private _dropService: DropService, private renderer: Renderer) {
        this._element = elementRef.nativeElement;
        DropTarget._ref_cnt++;
           if(!DropTarget.listeners['drop']){
               DropTarget.listeners['drop'] = this.renderer.listenGlobal('window', 'drop', (e: Event) => {
                   this._dropService.event['drop'](e);
               });
        }
           if(!DropTarget.listeners['dragover']){
               DropTarget.listeners['dragover'] = this.renderer.listenGlobal('window', 'dragover', (e: Event) => {
                   this._dropService.event['dragover'](e);
               });
        }
           if(!DropTarget.listeners['dragenter']){
               DropTarget.listeners['dragenter'] = this.renderer.listenGlobal('window', 'dragenter', (e: Event) => {
                   this._dropService.event['drop'](e);
               });
        }
           if(!DropTarget.listeners['dragleave']){
               DropTarget.listeners['dragleave'] = this.renderer.listenGlobal('window', 'dragleave', (e: Event) => {
                   this._dropService.event['dragleave'](e);
               });
        }
    }


    // Register the element you want to recieve drop events
    ngOnInit() {
        if (this.target) {
            this._element = this.renderer.selectRootElement(this.target);
        }

        this._unreg = this._dropService.register(this.stream, this._element, this._doHighlight.bind(this));
    }

    ngOnChanges(changes: any){
        setTimeout(() => {
            if(changes.target && this.target) {
                    // Change the drop target
                this._unreg();
                this._element = document.querySelector(this.target);
                   this._unreg = this._dropService.register(this.stream, this._element, this._doHighlight.bind(this));
                this._doHighlight(false);
            }
            if(changes.stream) {
                    // Change the drop stream
                this._unreg();
                   this._unreg = this._dropService.register(this.stream, this._element, this._doHighlight.bind(this));
            }
        }, 20);
    }

    // Ensure all the bindings and classes are removed
    ngOnDestroy() {
        this._unreg();

        // In case the drop-target is another element (not the ElementRef)
        this._doHighlight(false);
        DropTarget._ref_cnt--;
        if(DropTarget._ref_cnt <= 0) {

        }
    }


    // Applies the hover class to the element
    private _doHighlight(state: boolean) {
        if (state) {
            this.renderer.setElementClass(this._element, this.indicate, true);
        } else {
            let class_list: string = this._element.class;
            class_list = class_list.replace(this.indicate, '');
            this.renderer.setElementClass(this._element, class_list, false);
        }
    }
}
