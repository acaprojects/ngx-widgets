/**
 * @Author: Stephen von Takack
 * @Date:   13/09/2016 2:55 PM
 * @Email:  steve@acaprojects.com
 * @Filename: file-stream.directive.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 15/12/2016 11:35 AM
 */

import { ElementRef, Input, Renderer } from '@angular/core';
import { Directive, OnInit } from '@angular/core';
import { DropService } from '../services/drop-service/drop-service.service';

@Directive({
    selector: '[file-stream]',
    // If added as a provider then a new instance is created for every DropTarget
    // this is not desirable and as drop service should be available application wide
    // it should be added to the initial bootstrap
})
export class FileStreamDirective implements OnInit {
    @Input('file-stream') public stream = ''; // name of the stream the files should be sent to
    private _element: HTMLInputElement;

    constructor(elementRef: ElementRef<HTMLInputElement>, private _dropService: DropService, private renderer: Renderer) {
        this._element = elementRef.nativeElement;
    }

    // Hook up the file selection box with an event handler to
    // push the files to the selected stream
    public ngOnInit() {
        this.renderer.listen(this._element, 'change', () => {
            this._dropService.pushFiles(this.stream, this._element.files);
        });
    }
}
