import { Component, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { DropService } from '../file-drop';

@Component({
	selector: 'img-crop',
	templateUrl: './img-crop.template.html',
	styles: [ require('./img-crop.styles.scss') ]
})
export class ImageCrop {
	@Input() id: string  = '';
	@Input() circle: boolean = false;

	@Output() completed = new EventEmitter();

	@ViewChild('cropper') image_cropper : ImageCropperComponent;
	@ViewChild('image') canvas : ElementRef;

	file: any = null;
	data: any = {};
	image: any = null;
	loading: boolean = false;
	cropperSettings: CropperSettings = null;
	zoom: number = 100;
	image_data: string = null;
	saving = false;
	stream: any = null;
	sub: any = null;

	constructor(private drop_service: DropService) {
	    this.cropperSettings = new CropperSettings();
	    this.cropperSettings.noFileInput = true;
	    this.cropperSettings.responsive = true;
	    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(0,0,0,0.87)';
	    this.data = {};
	}

	ngAfterViewInit() {
		if(this.id === '') this.id = 'zero';
	    if(!this.stream) this.stream = this.drop_service.getStream('img-crop' + (this.id !== '' ? '-' + this.id: ''));
		this.sub = this.stream.subscribe((obj) => {
		    if (obj.data && obj.event === 'drop') {
		        obj.data.promise.then((data) => {
		            // At this point all file data has been collected
		            this.loadImage(data.files[0]);
		        }, (err) => {
		        	console.error(err);
		        });
		    }
		})
			// Make cropper fit the bounding div
		if(this.canvas) {
			let p_rect = this.canvas.nativeElement.parentElement.getBoundingClientRect();
			this.cropperSettings.canvasWidth = p_rect.width;
			this.cropperSettings.canvasHeight = p_rect.height;
		}
		this.cropperSettings.rounded = this.circle;
	}

	loadImage(file: File) {
		this.loading = true;
	    this.image = new Image();
	    //let file:File = $event.target.files[0];
	    let myReader:FileReader = new FileReader();
	    myReader.onloadend = (loadEvent:any) => {
	        this.image.src = loadEvent.target.result;
	        this.image_data = loadEvent.target.result;
	        setTimeout(() => {
		        this.image_cropper.setImage(this.image);
		        this.loading = false;
	        }, 20);
	    };
	    myReader.readAsDataURL(file);
	}

	saveImage() {
		this.saving = true;
		this.completed.emit(this.data.image);
		setTimeout(() => {
			this.saving = false;
		}, 100)
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
