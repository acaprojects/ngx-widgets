/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   19/09/2016 1:51 PM
 * @Email:  alex@yuion.net
 * @Filename: img-crop.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:30 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DropService } from '../../services';

@Component({
    selector: 'img-crop',
    templateUrl: './img-crop.template.html',
    styleUrls: [ './img-crop.styles.scss' ],
})
export class ImageCrop {
    @Input() public id: string  = 'zero';
    @Input() public circle: boolean = false;
    @Input() public file: any = null;
    @Input() public select: boolean = true;
    @Input() public ratio: string = '4:3';
    @Input() public width: number = 400;

    @Output() public completed = new EventEmitter();

    public loading: boolean = false;
    public zoom: number = 100;
    public image_data: string = null;
    public saving = false;
    public data: any = {};
    public image: any = null;
    public error: any = null;

    @ViewChild('image') private canvas: ElementRef;

    private stream: any = null;
    private sub: any = null;

    constructor(private drop_service: DropService) {
        this.setupSize();
        this.data = {};
    }

    public ngOnChanges(changes: any) {
        if (changes.file) {
            this.loadImage(this.file);
        }
        if (changes.width || changes.ratio) {
            this.setupSize();
        }
    }

    public ngAfterViewInit() {
        if (this.id === '') {
            this.id = 'zero';
        }
        if (!this.stream) {
            this.stream = this.drop_service.getStream('img-crop' + (this.id !== '' ? '-' + this.id : ''));
        }
        this.sub = this.stream.subscribe((obj: any) => {
            if (obj.data && obj.event === 'drop') {
                obj.data.promise.then((data: any) => {
                    // At this point all file data has been collected
                    this.loadImage(data.files[0]);
                }, (err: any) => {
                    return;
                });
            }
        });
    }
    /**
     * Sets up the size of the cropped image
     * @return {void}
     */
    public setupSize() {
        const ratio: { x: any, y: any } = { x: this.ratio.split(':')[0], y: this.ratio.split(':')[1] };
    }
    /**
     * Loads the image and injects it into the image cropper component
     * @param  {File} Image file from file input field
     * @return {void}
     */
    public loadImage(file: File) {
        if (!file) {
            return;
        }
        this.loading = true;
        this.image = new Image();
        const myReader: FileReader = new FileReader();
        myReader.onloadend = (loadEvent: any) => {
            this.image.src = loadEvent.target.result;
            this.image_data = loadEvent.target.result;
            setTimeout(() => {
                this.setImage(this.image);
                this.loading = false;
            }, 20);
        };
        myReader.readAsDataURL(file);
    }

    public setImage(img: any) {
        return;
    }
    /**
     * Emits the cropped image data.
     * @return {void}
     */
    public saveImage() {
        this.saving = true;
        this.completed.emit(this.data.image);
        setTimeout(() => {
            this.saving = false;
        }, 100);
    }

    public ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}
