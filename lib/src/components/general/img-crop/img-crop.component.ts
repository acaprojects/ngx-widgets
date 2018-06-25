/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   19/09/2016 1:51 PM
 * @Email:  alex@yuion.net
 * @Filename: img-crop.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:30 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DropService } from '../../../services/drop-service/drop-service.service';

import 'cropperjs';

declare let Cropper: any;

@Component({
    selector: 'img-crop',
    templateUrl: './img-crop.template.html',
    styleUrls: [ './img-crop.styles.scss' ],
})
export class ImageCropComponent {
    @Input() public id  = 'zero';
    @Input() public circle = false;
    @Input() public file: any = null;
    @Input() public select = true;
    @Input() public ratio = '4:3';
    @Input() public width = 400;

    @Output() public saved = new EventEmitter();

    public model: any = {
        image: null,
        data: {},
        zoom: 100
    };

    @ViewChild('image') private image: ElementRef;

    private stream: any = null;
    private sub: any = null;

    constructor(private drop_service: DropService) {
        this.setupSize();
        this.model.data = {};
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
                }, (err: any) => null);
            }
        });
    }
    /**
     * Sets up the size of the cropped image
     * @return
     */
    public setupSize() {
        const ratio: { x: any, y: any } = { x: this.ratio.split(':')[0], y: this.ratio.split(':')[1] };
    }
    /**
     * Loads the image and injects it into the image cropper component
     * @param Image file from file input field
     * @return
     */
    public loadImage(file: File) {
        if (!file) { return; }
        this.model.loading = true;
        this.model.image = new Image();
        const myReader: FileReader = new FileReader();
        myReader.onloadend = (loadEvent: any) => {
            this.model.image.src = loadEvent.target.result;
            this.model.image_data = loadEvent.target.result;
            this.setupCropper();
            setTimeout(() => {
                this.setImage(this.image);
                this.model.loading = false;
            }, 20);
        };
        myReader.readAsDataURL(file);
    }

    public setImage(img: any) {
        return;
    }
    /**
     * Emits the cropped image data.
     * @return
     */
    public saveImage() {
        this.model.saving = true;
        this.saved.emit(this.model.data.image);
        setTimeout(() => this.model.saving = false, 100);
    }

    public ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    private setupCropper() {
        if (this.image && this.image.nativeElement) {
            const ratio: { x: any, y: any } = { x: this.ratio.split(':')[0], y: this.ratio.split(':')[1] };
            this.model.cropper = new Cropper(this.image.nativeElement, { aspectRatio: ratio.x / ratio.y });
        }
    }
}
