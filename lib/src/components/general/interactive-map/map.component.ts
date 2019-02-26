
import { Component, Input, OnInit, OnChanges, Output, EventEmitter, TemplateRef, Type, SimpleChanges } from '@angular/core';

import { BaseWidgetComponent } from '../../../shared/base.component';
import { MapService } from '../../../services/map.service';
import { IMapPoint } from './map-renderer/map-renderer.component';
import { IMapListener } from './map-styler.directive';
import { timeout } from 'q';

export interface IMapPointOfInterest {
    id?: string;
    coordinates?: IMapPoint;
    cmp: Type<any>;
    template?: TemplateRef<any>;
    model?: { [name: string]: any };
    data?: { [name: string]: any };
    zoom?: number;
    exists?: boolean;
    instance?: any;
    center?: IMapPoint;
    service?: any;
}

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
    @Input() public src: string;
    @Input('styles') public css: { [name: string]: ({ [name: string]: (number | string) }) };
    @Input() public zoom: number;
    @Input() public poi: IMapPointOfInterest[];
    @Input() public focus: IMapPointOfInterest;
    @Input() public listeners: IMapListener[];
    @Input() public center: IMapPoint;
    @Input() public lock: boolean;
    @Output() public zoomChange = new EventEmitter();
    @Output() public centerChange = new EventEmitter();
    @Output() public event = new EventEmitter();

    public model: { [name: string]: any } = {};

    constructor(private service: MapService) {
        super();
    }

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
            if (this.focus && this.focus.cmp) {
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
                    this.model[key] = data[key]
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
