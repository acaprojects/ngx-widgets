import { Component, Input, ElementRef, ViewChild, Output, EventEmitter, Renderer2 } from '@angular/core';
import { BaseWidgetComponent } from '../../../../shared/base.component';
import { MapService } from '../../../../services/map.service';
import { MapUtilities } from '../map.utilities';

export interface MapPoint {
    x: number,
    y: number
}

@Component({
    selector: 'map-overlay-container',
    templateUrl: `./map-renderer.template.html`,
    styleUrls: [`./map-renderer.styles.scss`]
})
export class MapRendererComponent extends BaseWidgetComponent {
    @Input() public scale: number = 1;
    @Input() public center: MapPoint = { x: .5, y: .5 };
    @Input() public src: string = '';
    @Input() public redraw: any = null;
    @Output() public map = new EventEmitter();

    @ViewChild('canvas') private canvas: ElementRef;
    @ViewChild('content') private content: ElementRef;

    public model: any = {};

    constructor(private service: MapService, private renderer: Renderer2) {
        super();
    }

    public ngOnInit() {
        this.subs.obs.resize = this.renderer.listen('window', 'resize', () => this.resize());
    }

    public ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
        if (changes.zoom || changes.center) {
            this.update();
        }
        if (changes.src) {
            this.loadMap();
        }
        if (changes.redraw) {
            this.renderImage();
        }
    }

    /**
     * Update display of map
     */
    public update() {
        this.timeout('update', () => {
            this.model.zooming = false;
            this.model.panning = false;
            this.updateZoom();
            this.updatePosition();
        }, 10);
    }

    /**
     * Update the drawn zoom level of the map
     */
    public updateZoom() {
        if (!this.model.zoom) { this.model.zoom = this.scale * 100; }
        if (this.model.zoom !== this.scale * 100) {
            this.model.zooming = true;
            this.model.zoom += Math.max(.1, (this.scale - this.model.zoom) / 20);
            this.update();
        }
    }

    /**
     * Update the drawn position of the map
     */
    public updatePosition() {
        if (!this.model.center) { this.model.center = this.center; }
        if (this.model.center.x !== this.center.x) {
            this.model.panning = true;
            this.model.center.y += Math.max(.005, (this.center.x - this.model.center.x) / 20);
            this.update();
        }
        if (this.model.center.y !== this.center.y) {
            this.model.panning = true;
            this.model.center.y += Math.max(.005, (this.center.y - this.model.center.y) / 20);
            this.update();
        }
            // Generate draw position
        this.model.position = {
            x: -50 + -((this.model.center.x - .5) * 100),
            y: -50 + -((this.model.center.y - .5) * 100)
        };
    }

    private loadMap() {
        this.model.loading = true;
        this.service.loadMap(this.src).then((data) => {
            this.model.map_data = data;
            this.timeout('load', () => {
                this.model.loading = false;
                if (this.content) {
                    this.model.map = this.content.nativeElement.querySelector('svg');
                    this.resize();
                    this.map.emit(this.model.map);
                }
            });
        }, () => this.service.log('Error', `Unable to load map '${this.src}'`));
    }

    /**
     * Render SVG map to an image to draw while zooming
     */
    private renderImage() {
        if (!this.content || !this.model.map) {
            return this.timeout('render', this.renderImage(), 100);
        }
        let box = this.model.map.getBoundingClientRect();
        let width = window.devicePixelRatio * window.innerWidth;
        let ratio = (box.width / box.height) || 1;
        if (this.model.img) { delete this.model.img; }
        this.model.img = document.createElement('img');
        const canvas = this.canvas.nativeElement;
        const context = canvas.getContext('2d');
        this.model.img.onerror = (err) => console.log(err);
        this.model.img.onload = () => {
            canvas.width = width;
            canvas.height = width / ratio;
            context.drawImage(this.model.img, 0, 0, canvas.width, canvas.height);
        };
        const data_with_styles = (this.model.map || '').replace(`</style>`, `${this.model.simple_styles}</style>`)
            .replace('<svg', `<svg width="${width}px" height="${Math.floor(width / ratio)}px"`);
        const base64_data = MapUtilities.base64Encode(data_with_styles);
        this.model.img.src = `data:image/svg+xml;base64,${base64_data}`;
    }

    /**
     * Scale map to fit in the the parent container
     */
    private resize() {
        const box =
    }
}
