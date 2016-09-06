import { Input, ElementRef } from '@angular/core';
import { Directive, OnInit } from '@angular/core';
import { DropService } from './drop-service.service';


@Directive({
    selector: '[file-stream]',
    // If added as a provider then a new instance is created for every DropTarget
    // this is not desirable and as drop service should be available application wide
    // it should be added to the initial bootstrap
})
export class FileStream implements OnInit {
	@Input('file-stream') fileStream: string = ''; // name of the stream the files should be sent to
    private _element: any;

    constructor(elementRef: ElementRef, private _dropService: DropService) {
        this._element = elementRef.nativeElement;
    }

    // Hook up the file selection box with an event handler to
    // push the files to the selected stream
    ngOnInit() {
        this._element.addEventListener('change', () => {
            this._dropService.pushFiles(this.fileStream, this._element.files);
        }, false);
    }
}
