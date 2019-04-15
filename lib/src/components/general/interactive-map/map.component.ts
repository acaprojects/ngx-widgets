
import { Component, Input, OnChanges, Output, EventEmitter, TemplateRef, Type, SimpleChanges, Injector } from '@angular/core';

import { IMapPoint } from './map-renderer/map-renderer.component';
import { IMapListener } from './map-styler.directive';
import { BaseWidgetComponent } from '../../../shared/base.component';

export interface IMapPointOfInterest<T = any> {
    /** Unique identifier for the Point of interest */
    uid: string;
    /** Map Element selector */
    id?: string;
    /** Map coordinates */
    coordinates?: IMapPoint;
    /** Content to render at position */
    content: MapOverlayContent;
    /** Content render method. Determined automatically */
    method?: string;
    /** Data to inject into the content template/component */
    data?: T;
    /** Zoom level used when focusing on the POI */
    zoom?: number;
    /** Inject for passing data into components */
    injector?: Injector;
    /** Map render location. Determined based on coordinates or element grabbed using id */
    center?: IMapPoint;
}

/** Valid content types Template, Component or HTML string */
export type MapOverlayContent = TemplateRef<any> | Type<any> | string;

@Component({
    selector: 'map',
    templateUrl: './map.template.html',
    styles: [`
        .container {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 12em;
            min-width: 12em;
            overflow: hidden;
        }
        i { display: none }
    `]
})
export class MapComponent extends BaseWidgetComponent implements OnChanges {
    /** URL to the map SVG file */
    @Input() public src: string;
    /** CSS styles to apply to the map */
    @Input('styles') public css: { [name: string]: ({ [name: string]: (number | string) }) };
    /** Zoom level as a percentage */
    @Input() public zoom: number;
    /** Points of interest to render on the map */
    @Input() public poi: IMapPointOfInterest[];
    /** Point on map to center on */
    @Input() public focus: IMapPointOfInterest;
    /** Event listeners for elements on the map */
    @Input() public listeners: IMapListener[];
    /** Center point of the map */
    @Input() public center: IMapPoint;
    /** Disable moving and zooming the map */
    @Input() public lock: boolean;
    /** Emitter for changes to the zoom percentage */
    @Output() public zoomChange = new EventEmitter();
    /** Emitter for changes to the center position */
    @Output() public centerChange = new EventEmitter();
    /** Emitter for listened events */
    @Output() public event = new EventEmitter();

    public model: { [name: string]: any } = {};

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        const data: { [name: string]: any } = {};
        if (changes.css) { data.styles = this.css; }
        if (changes.zoom) { data.scale = (this.zoom || 100) / 100; }
        if (changes.center) { data.center = this.center; }
        if (changes.src) { data.src = this.src; }
        if (changes.listeners) { data.listeners = this.listeners; }
        if (changes.focus) { data.focus = this.focus; }
        if (changes.lock) { data.lock = this.lock; }
        if (changes.poi) {
            if (this.focus && this.focus.content) {
                data.interest_points = [data.focus || this.model.focus, ...this.poi];
            } else {
                data.interest_points = this.poi;
            }
        }
        this.update(data);
    }

    public update(data: { [name: string]: any }) {
        // this.timeout('changes', () => {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    this.model[key] = data[key];
                }
            }
        // }, 10);
    }

    public post() {
        if (this.model.scale !== this.zoom / 100) {
            this.zoom = +((this.model.scale || 1) * 100).toFixed(2);
            this.zoomChange.emit(this.zoom);
        }
        if (this.model.center !== this.center) {
            this.center = this.model.center;
            this.centerChange.emit(this.center);
        }
    }

    public handleEvent(e) {

    }

    public updateMap(el: SVGElement) {
        this.timeout('map', () => this.model.map = el, 10);
    }

}
