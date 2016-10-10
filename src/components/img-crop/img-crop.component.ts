import { Component, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { DropService } from '../../services';

@Component({
	selector: 'img-crop',
	templateUrl: './img-crop.template.html',
	styleUrls: [ './img-crop.styles.css' ]
})
export class ImageCrop {
	@Input() id: string  = 'zero';
	@Input() circle: boolean = false;
	@Input() file: any = null;
	@Input() select: boolean = true;
	@Input() ratio: string = '4:3';
	@Input() width: number = 400;

	@Output() completed = new EventEmitter();

	@ViewChild('cropper') image_cropper : ImageCropperComponent;
	@ViewChild('image') canvas : ElementRef;

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
	    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,0.87)';
		this.setupSize();
	    this.data = {};
	}

	ngOnChanges(changes: any) {
		if(changes.file) {
			this.loadImage(this.file);
		}
		if(changes.width || changes.ratio) {
			this.setupSize();
		}
	}

	ngAfterViewInit() {
		if(this.id === '') this.id = 'zero';
	    if(!this.stream) this.stream = this.drop_service.getStream('img-crop' + (this.id !== '' ? '-' + this.id: ''));
		this.sub = this.stream.subscribe((obj: any) => {
		    if (obj.data && obj.event === 'drop') {
		        obj.data.promise.then((data: any) => {
		            // At this point all file data has been collected
		            this.loadImage(data.files[0]);
		        }, (err: any) => {
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

	setupSize() {
		let ratio: { x:any, y:any } = { x: this.ratio.split(':')[0], y: this.ratio.split(':')[1] };
		this.cropperSettings.width = this.width;
		this.cropperSettings.height = this.width * ratio.y/ratio.x;
		this.cropperSettings.croppedWidth = this.width;
		this.cropperSettings.croppedHeight = this.width * ratio.y/ratio.x;
	}

	loadImage(file: File) {
		if(!file) return;
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
		if(this.sub) this.sub.unsubscribe();
	}
}
