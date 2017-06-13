/**
 * @Author: Stephen von Takack
 * @Date:   21/09/2016 9:26 AM
 * @Email:  steve@acaprojects.com
 * @Filename: drop-target.directive.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 15/12/2016 11:35 AM
 */

import { ElementRef, Input, Renderer2 } from '@angular/core';
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { DropService } from '../services';

@Directive({
    selector: '[drop-target]',
})
export class DropTarget implements OnInit, OnDestroy {
    private static _ref_cnt: number = 0;
    private lstn: any = {};

    @Input('drop-target') public target: string;     // defaults to self, otherwise you can define a valid querySelector
    @Input() public indicate: string = 'drop-indicate';  // defines the hover class to apply, defaults to: drop-indicate
    @Input() public stream: string;                      // name of the stream the files should be sent to

    private _element: any;
    private _unreg: () => void;

    constructor(private el: ElementRef, private _dropService: DropService, private renderer: Renderer2) {
    }

    // Register the element you want to recieve drop events
    public ngOnInit() {
        this._element = this.el.nativeElement;
        if (this.target) {
            this._element = this.renderer.selectRootElement(this.target);
        }
        this.listen();
        this._unreg = this._dropService.register(this.stream, this._element, this._doHighlight.bind(this));
    }

    public ngOnChanges(changes: any) {
        setTimeout(() => {
            if (changes.target && this.target) {
                // Change the drop target
                this._unreg();
                this._element = this.renderer.selectRootElement(this.target);
                this.listen();
                this._unreg = this._dropService.register(this.stream, this._element, this._doHighlight.bind(this));
                this._doHighlight(false);
            }
            if (changes.stream) {
                // Change the drop stream
                this._unreg();
                this._unreg = this._dropService.register(this.stream, this._element, this._doHighlight.bind(this));
            }
        }, 20);
    }

    // Ensure all the bindings and classes are removed
    public ngOnDestroy() {
        this._unreg();

        // In case the drop-target is another element (not the ElementRef)
        this._doHighlight(false);
        DropTarget._ref_cnt--;
        if (DropTarget._ref_cnt <= 0) {
            DropTarget._ref_cnt = 0;
            return;
        }
    }
    // Sets up  listeners for drop events on the target element
    private listen() {
        if (!this._element) {
            return;
        }
        this.lstn.drop = this.renderer.listen(this._element, 'drop', (e: Event) => {
            this._dropService.event.drop(e);
        });
        this.lstn.dragover = this.renderer.listen(this._element, 'dragover', (e: Event) => {
            this._dropService.event.dragover(e);
        });
        this.lstn.dragenter = this.renderer.listen(this._element, 'dragenter', (e: Event) => {
            this._dropService.event.dragenter(e);
        });
        this.lstn.dragleave = this.renderer.listen(this._element, 'dragleave', (e: Event) => {
            this._dropService.event.dragleave(e);
        });
    }

    // Applies the hover class to the element
    private _doHighlight(state: boolean) {
        if (state) {
            this.renderer.addClass(this._element, this.indicate);
        } else {
            this.renderer.removeClass(this._element, this.indicate);
        }
    }
}
