import { Component, Input, ElementRef, ViewChild, Output, EventEmitter, Renderer2, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { MapUtilities } from '../map.utilities';
import { IMapPointOfInterest } from '../map.component';
import { MapService } from '../../../../services/map.service';
import { BaseWidgetComponent } from '../../../../shared/base.component';

export interface IMapPoint {
    /** x coordinate */
    x: number;
    /** y coordinate */
    y: number;
}

@Component({
    selector: 'aca-map-renderer',
    templateUrl: `./map-renderer.template.html`,
    styleUrls: [`./map-renderer.styles.scss`]
})
export class MapRendererComponent extends BaseWidgetComponent implements OnInit, OnChanges {
    /** Zoom level of the map */
    @Input() public scale = 1;
    /** Point within the map to center in the view */
    @Input() public center: IMapPoint = { x: .5, y: .5 };
    /** URL of the Map SVG to render */
    @Input() public src = '';
    /** CSS styles to apply to the map */
    @Input() public css = '';
    /** Re-renders the map on changes to this */
    @Input() public redraw: any = null;
    /** List of points of interest */
    @Input() public items: IMapPointOfInterest[];
    /** Change emitter for SVG DOM element */
    @Output() public map = new EventEmitter();

    /** Block to render SVG element */
    @ViewChild('renderBlock') public render_block: ElementRef;
    /** Canvas to render static images of map when zooming */
    @ViewChild('canvas') private canvas: ElementRef;
    @ViewChild('content') private content: ElementRef;
    @ViewChild('container') private container: ElementRef;

    public model: { [name: string]: any } = {};

    constructor(private service: MapService, private renderer: Renderer2, private el: ElementRef) {
        super();
    }

    public ngOnInit() {
        this.subs.obs.resize = this.renderer.listen('window', 'resize', () => this.resize());
        this.model.center = { x: .5, y: .5 };
        this.model.position = { x: -50, y: -50 };
        this.model.loading = true;
        if (this.el) { this.renderer.setAttribute(this.el.nativeElement, `map-${this.id}`, 'true') }
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        if (changes.scale || changes.center) {
            this.update();
        }
        if (changes.src) {
            this.loadMap();
        }
        if (changes.redraw || changes.css) {
            this.renderImage();
        }
    }

    public get isIE() {
        const uaString = navigator.userAgent;
        var match = /\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/.exec(uaString);
        if (match) return parseInt(match[2]) < 12;
        return false;
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
        }, 5);
    }

    /**
     * Update the drawn zoom level of the map
     */
    public updateZoom() {
        const scale = (this.scale || 1) * 100;
        if (!this.model.zoom) { this.model.zoom = scale; }
        if (this.model.zoom !== scale) {
            this.model.zooming = true;
            const dir = scale - this.model.zoom < 0 ? -1 : 1;
            this.model.zoom += Math.min(Math.max(.1, Math.abs(scale - this.model.zoom) / 10), 50) * dir;
            if (Math.abs(scale - this.model.zoom) < .5) { this.model.zoom = scale }
            this.update();
        }
    }

    /**
     * Update the drawn position of the map
     */
    public updatePosition() {
        const center = this.center || { x: .5, y: .5};
        if (!this.model.center) { this.model.center = center; }
        if (this.model.center.x !== center.x) {
            this.model.panning = true;
            const dir = center.x - this.model.center.x < 0 ? -1 : 1;
            this.model.center.x += Math.min(Math.max(.0001, Math.abs(center.x - this.model.center.x) / 5), .1) * dir;
            if (Math.abs(center.x - this.model.center.x) < .005) { this.model.center.x = center.x }
            this.update();
        }
        if (this.model.center.y !== center.y) {
            this.model.panning = true;
            const dir = center.y - this.model.center.y < 0 ? -1 : 1;
            this.model.center.y += Math.min(Math.max(.0001, Math.abs(center.y - this.model.center.y) / 5), .1) * dir;
            if (Math.abs(center.y - this.model.center.y) < .005) { this.model.center.y = center.y }
            this.update();
        }
            // Generate draw position
        this.model.position = {
            x: -50 -((this.model.center.x - .5) * 100),
            y: -50 -((this.model.center.y - .5) * 100)
        };
    }

    /**
     * Load map data from SVG file
     */
    private loadMap() {
        this.model.loading = true;
        this.map.emit(null);
        this.model.map_data = '';
        this.service.loadMap(this.src).then((data) => {
            this.model.map_data = data;
            this.timeout('load', () => {
                if (this.content) {
                    this.model.loading = true;
                    this.model.map = this.content.nativeElement.querySelector('svg');
                    this.renderImage();
                    this.timeout('resize', () => this.resize());
                    if (this.model.map) {
                        this.renderer.setAttribute(this.model.map, 'preserveAspectRatio', 'xMidYMid meet');
                        this.renderer.setStyle(this.model.map, 'width', '100%');
                        this.renderer.setStyle(this.model.map, 'margin', 'auto');
                    }
                    this.map.emit(this.model.map);
                }
            });
        }, () => this.service.log('Error', `Unable to load map '${this.src}'`));
    }

    /**
     * Render SVG map to an image to draw while zooming
     */
    private renderImage() {
        this.timeout('render', () => {
            if (!this.content || !this.model.map) {
                return this.renderImage();
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
            const data_with_styles = (this.model.map_data || '').replace(`</style>`, `${this.css}</style>`)
                .replace('<svg', `<svg width="${width}px" height="${Math.floor(width / ratio)}px" preserveAspectRatio="xMidYMid meet"`);
            const base64_data = MapUtilities.base64Encode(data_with_styles);
            this.model.img.src = `data:image/svg+xml;base64,${base64_data}`;
        })
    }

    /**
     * Scale map to fit in the the parent container
     */
    private resize() {
        if (this.container && this.model.map) {
            const box = this.container.nativeElement.getBoundingClientRect();
            const map_box = this.model.map.getBoundingClientRect();
                // Check that map is rendered
            if (map_box.height === 0 || map_box.width === 0) {
                return this.timeout('resize_fail', () => this.resize());
            }
            const box_ratio = box.width / box.height;
            const map_ratio = map_box.width / map_box.height;
            this.model.ratio = Math.min(map_ratio / box_ratio, 1);
            this.model.h_ratio = Math.min(1, map_ratio * ((map_box.height / box.height) / this.scale));
            this.model.loading = false;
        } else {
            if (!this.model.map) {
                this.model.map = this.content.nativeElement.querySelector('svg');
            }
            this.timeout('resize_fail', () => this.resize());
        }
    }
}
