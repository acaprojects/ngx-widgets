
import { Component, Input, OnInit, OnChanges, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Type } from '@angular/compiler';

import { BaseWidgetComponent } from '../../../shared/base.component';
import { MapService } from '../../../services/map.service';
import { IMapPoint } from './map-renderer/map-renderer.component';

export interface IMapPointOfInterest {
    id?: string;
    coordinates?: IMapPoint;
    cmp: Type;
    template?: TemplateRef<any>;
    model?: any;
    zoom?: number;
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
    @Input('styles') public css: any;
    @Input() public zoom: number;
    @Input() public poi: IMapPointOfInterest[];
    @Input() public focus: IMapPointOfInterest;
    @Input() public listeners: number;
    @Input() public center: IMapPoint;
    @Input() public lock: boolean;
    @Output() public zoomChange = new EventEmitter();
    @Output() public centerChange = new EventEmitter();
    @Output() public event = new EventEmitter();

    public model: any = {};

    constructor(private service: MapService) {
        super();
    }

    public ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
        if (changes.css) {
            this.model.styles = this.css;
        }
        if (changes.src) {
            this.model.src = this.src;
        }
        if (changes.zoom) {
            this.model.scale = (this.zoom || 100) / 100;
        }
        if (changes.focus) {
            this.model.focus = this.focus;
        }
    }

    public post() {
        if (this.model.scale !== this.zoom / 100) {
            this.zoom = this.model.scale * 100;
            this.zoomChange.emit(this.zoom);
        }
        if (this.model.center !== this.center) {
            this.center = this.model.center;
            this.centerChange.emit(this.center);
        }
    }

    public handleEvent(e) {

    }

}
