import { Component, Input, Output, EventEmitter, SimpleChanges, Renderer2, OnInit, OnChanges, TemplateRef, ReflectiveInjector, Injector, Injectable } from '@angular/core';

import { BaseWidgetComponent } from '../../../../shared/base.component';

import { IMapPointOfInterest } from '../map.component';
import { MapUtilities } from '../map.utilities';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PointOfInterest {
    data: IMapPointOfInterest;
    listen: BehaviorSubject<number>;
    constructor(poi: IMapPointOfInterest, listen: BehaviorSubject<number>) {
        this.data = poi.data || {};
        this.listen = listen;
    };
}

@Component({
    selector: 'map-overlay-outlet',
    templateUrl: './map-overlay-outlet.component.html',
    styleUrls: ['./map-overlay-outlet.component.scss']
})
export class MapOverlayOutletComponent extends BaseWidgetComponent implements OnInit, OnChanges {
    /** List of points of interest */
    @Input() items: IMapPointOfInterest[];
    /** Map elment render to the DOM */
    @Input() map: SVGElement;
    /** Map root element */
    @Input() container: HTMLDivElement;
    /** Zoom level as decimal */
    @Input() scale: number;
    /** Event emitter for Point of interest events */
    @Output() event = new EventEmitter();

    protected list: IMapPointOfInterest[] = [];
    protected _scale_subject = new BehaviorSubject<number>(1);

    constructor(private injector: Injector, protected renderer: Renderer2) {
        super();
    }

    public ngOnInit() {
        if (this.isIE()) {
            this.renderer.listen('window', 'resize', () => {
                this.timeout('update', () => this.processItems(), 200);
            });
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.items || changes.map) {
            this.timeout('update', () => this.processItems(), changes.map && !changes.map.previousValue ? 1000 : 200);
        }
        if (changes.scale) {
            this._scale_subject.next(this.scale);
            this.processItems();
        }
    }

    public processItems() {
        if (!this.items) { return; }
        if (this.items.length <= 0) { this.list = []; return; }
        this.timeout('process', () => {
            this.list = [];
            const view_box = this.map.getAttribute('viewBox').split(' ');
            const map_box = this.map.getBoundingClientRect();
            const box = this.container.getBoundingClientRect();
            const x_scale = Math.max(1, (map_box.width / map_box.height) / (+view_box[2] / +view_box[3]));
            const y_scale = Math.max(1, (map_box.height / map_box.width) / (+view_box[3] / +view_box[2]));
            for (const poi of this.items) {
                this.setMethod(poi);
                this.calculatePosition(poi, { x_scale, y_scale, view: view_box, map: map_box, cntr: box });
            }
            this.list = [ ...this.items ];
        });
    }

    /**
     * Set content render method for point of interest
     * @param item POI item
     */
    public setMethod(item: IMapPointOfInterest) {
        item.method = 'component';
        if (item.data) {
            item.data.scale = this.scale;
            item.data.map_
        }

        if (typeof item.content === 'string') {
            item.method = 'text';
        } else if (item.content instanceof TemplateRef) {
            item.method = 'template';
        } else {
            item.injector = Injector.create([
                { provide: PointOfInterest, useValue: new PointOfInterest(item, this._scale_subject) }
            ], this.injector);
        }
    }

    /**
     * Calculate render position of the given point of interest
     * @param item POI Item
     */
    public calculatePosition(item: IMapPointOfInterest, details: { [name: string]: any }) {
        const el = item.id ? this.map.querySelector(MapUtilities.cleanCssSelector(`#${item.id}`)) : null;
        if (el || item.coordinates) {
            const pos_box = this.isIE() && item.coordinates ? { width: +details.view[2], height: +details.view[3] } : details.cntr;
            item.center = MapUtilities.getPosition(pos_box, el, item.coordinates) || { x: .5, y: .5 };
            if (this.isIE() && item.coordinates) {
                // Normalise dimensions
                item.center.x = item.center.x / details.x_scale + (details.x_scale - 1) / 2;
                item.center.y = item.center.y / details.y_scale + (details.y_scale - 1) / 2;
            }
        }
    }

    public isIE() {
        return navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/)) || !!navigator.userAgent.match(/MSIE/g);
    }
}
