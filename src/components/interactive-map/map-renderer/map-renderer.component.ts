
import { Component, Input, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';

const win = window as any;
const DOMURL = win.URL || win.webkitURL || win;

@Component({
    selector: 'map-canvas-renderer',
    templateUrl: './map-renderer.template.html',
    styleUrls: ['./map-renderer.styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapCanvasRendererComponent {
    @Input() public map: string = '';
    @Input() public styles: any = {};
    @Input() public center: { x: number, y: number } = { x: .5, y: .5 };
    @Input() public scale: number = 1;
    public model: any = { box: { width: 1, height: 1 } };

    @ViewChild('container') private container: ElementRef;
    @ViewChild('canvas') private map_canvas: ElementRef;

    constructor() {}

    public ngAfterViewInit() {
        this.getBox();
        this.setupCanvas();
        this.createImage();
        this.renderMap();
    }

    public ngOnChanges(changes: any) {
        if (this.map) {
            if (changes.map || changes.style || !this.model.map){
                this.createImage();
            }
            if (changes.scale || changes.center){
                    // Render map onto canvas
                console.log('Rendering map to canvas');
                console.log('Map:', this.model.map.slice(0, 200));
                this.renderMap();
            }
        }
    }

    public resize() {
        this.getBox();
        this.setupCanvas();
    }

    public createImage() {
        console.log('Storing Map');
            // Load map into variable
        this.model.map = this.map;
            // Process custom map styles
        console.log('Rendering Custom Styles');
        const styles = this.renderStyles();
        this.model.map = this.model.map.replace('</styles>', `${styles}</styles>`);
        console.log('Styles:', styles);
        this.generateImage();
    }

    private renderStyles() {
        let styles = '';
        for (const id in this.styles) {
            if (this.styles.hasOwnProperty(id)) {
                const clean_id = id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
                const name = `svg ${id && (/^[\#\.\[]{1}.*/g).test(id) ? id : '#' + clean_id}`;
                let properties = '';
                for (const prop in this.styles[id]) {
                    if (this.styles[id].hasOwnProperty(prop)) {
                        properties += `  ${prop}: ${this.styles[id][prop]};`;
                    }
                }
                if (properties) {
                    styles += `${name} {${properties} } `;
                }
            }
        }
        return styles;
    }

    private renderMap(tries: number = 0) {
        if (tries > 10) { return; }
        if (this.map_canvas && this.map_canvas.nativeElement) {
            console.log('Canvas available for rendering');
            const cvs = this.map_canvas.nativeElement;
            const ctx = cvs.getContext("2d");
            console.log('Canvas:', this.map_canvas);
            if (this.model.image) {
                    // Render map onto canvas
                ctx.clearRect(0, 0, cvs.width, cvs.height);
                const pos = {
                    x: cvs.width * (this.center.x - .5),
                    y: cvs.height * (this.center.y - .5),
                };
                console.log('Drawing map to canvas');
                ctx.drawImage(this.model.image, pos.x, pos.y);
            } else {
                setTimeout(() => this.renderMap(++tries), 200);
            }
        } else {
            setTimeout(() => this.renderMap(++tries), 200);
        }
    }

    private generateImage() {
        if (this.model.url) {
            DOMURL.revokeObjectURL(this.model.url);
            this.model.image = null;
        }
        console.log('Generating Map Image');
        const image = new Image();
        const svg_blob = new Blob([this.model.map], {type: 'image/svg+xml;charset=utf-8'});
        const url = DOMURL.createObjectURL(svg_blob);
        image.onload = () => {
            console.log('Image loaded');
            this.model.image = image;
            this.model.url = url;
        };
        image.src = url;
        console.log('Image:', image);
    }

    private setupCanvas(tries: number = 0) {
        if (tries > 10) { return; }
        if (this.map_canvas && this.map_canvas.nativeElement) {
            console.log('Canvas available for rendering');
            const cvs = this.map_canvas.nativeElement;
            const ctx = cvs.getContext("2d");
                // Prevent canvas stretching
            cvs.style.width  = this.model.box.width + "px";
            cvs.style.height = this.model.box.height + "px";
                // Prevent rendering being blurred on devices with a higher pixel ratio
            const ratio = window.devicePixelRatio || 1;
            cvs.width  = this.model.box.width * ratio;
            cvs.height = this.model.box.height * ratio;
            ctx.scale(ratio * this.scale, ratio * this.scale);
            console.log('Canvas:', this.map_canvas);
        } else {
            setTimeout(() => this.setupCanvas(++tries), 200);
        }
    }

    private getBox(tries: number = 0) {
        if (tries > 10) { return; }
        if (this.container && this.container.nativeElement) {
            const box = this.container.nativeElement.getBoundingClientRect();
            this.model.box = box;
        } else {
            return setTimeout(() => this.getBox(++tries), 200);
        }
    }
}
