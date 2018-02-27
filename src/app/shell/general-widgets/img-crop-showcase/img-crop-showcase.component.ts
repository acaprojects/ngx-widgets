
import { Component } from '@angular/core';

@Component({
    selector: 'img-crop-showcase',
    templateUrl: './img-crop-showcase.template.html',
    styleUrls: ['./img-crop-showcase.styles.scss']
})
export class ImageCropperShowcaseComponent {
    // @Input() public id  = 'zero';
    // @Input() public circle = false;
    // @Input() public file: any = null;
    // @Input() public select = true;
    // @Input() public ratio = '4:3';
    // @Input() public width = 400;

    // @Output() public saved = new EventEmitter();
    public model: any = {
        title: 'Image Cropper',
        bindings: [
            {
                name: 'id', type: 'input', description: 'Identifier of the file stream used for dropping files', data: 'string',
                data_desc: '',
                example: `'stream-one'`
            }, {
                name: 'circle', type: 'input', description: 'Use circle for selecting crop area', data: 'boolean',
                data_desc: '',
                example: `true`
            }, {
                name: 'file', type: 'input', description: 'Binary data of the image file', data: 'string',
                data_desc: '',
                example: `'data:image/png;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0xNyAzSDVjLTEuMTEgMC0yIC45LTIgMnYxNGMwIDEuMS44OSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY3bC00LTR6bS01IDE2Yy0xLjY2IDAtMy0xLjM0LTMtM3MxLjM0LTMgMy0zIDMgMS4zNCAzIDMtMS4zNCAzLTMgM3ptMy0xMEg1VjVoMTB2NHoiLz4KPC9zdmc+'`
            }, {
                name: 'ratio', type: 'input', description: 'Aspect ratio of the selection area in format "x:y"', data: 'string',
                data_desc: '',
                example: `'16:9'`
            }, {
                name: 'width', type: 'input', description: 'Width of the selection area in pixels. Height is determined by the ratio binding', data: 'number',
                data_desc: '',
                example: `400`
            }, {
                name: 'saved', type: 'output', description: 'Emits the cropped image when user has pressed the save button.', data: 'boolean',
                data_desc: '',
                example: `'data:image/png;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0xNyAzSDVjLTEuMTEgMC0yIC45LTIgMnYxNGMwIDEuMS44OSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY3bC00LTR6bS01IDE2Yy0xLjY2IDAtMy0xLjM0LTMtM3MxLjM0LTMgMy0zIDMgMS4zNCAzIDMtMS4zNCAzLTMgM3ptMy0xMEg1VjVoMTB2NHoiLz4KPC9zdmc+'`
            }
        ],
        inject: '',
        map: {
            src: 'assets/australia.svg'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;img-crop id=&quot;avatar-stream&quot;
          ratio=&quot;1:1&quot;
          [circle]=&quot;false&quot;
          [width]=&quot;512&quot;
          (saved)=&quot;savedCroppedImage($event)&quot;&gt;
&lt;/img-crop&gt;`;
    }
}
