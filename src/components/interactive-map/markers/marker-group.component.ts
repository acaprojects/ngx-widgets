/**
* @Author: Alex Sorafumo <alex.sorafumo>
* @Date:   09/01/2017 12:03 PM
* @Email:  alex@yuion.net
* @Filename: marker-group.component.ts
* @Last modified by:   alex.sorafumo
* @Last modified time: 10/01/2017 1:38 PM
*/

import { Component, Input, ViewChild, ElementRef } from '@angular/core';

const DIM_LIMIT = 20000;

@Component({
    selector: 'map-marker-group',
    templateUrl: './marker-group.template.html',
    styleUrls: ['./marker-group.styles.css']
})
export class MapMarkerGroupComponent {
    @Input() markers: any[] = [];
    @Input() rotate: number = 0;
    @Input() radius: number = 1;
    @Input() disable: boolean = false;
    @Input() map: any = {
        pos: { x: 0, y: 0 },
        dim: { x: 100, y: 100 },
        real_dim: { x: 100, y: 100 }
    }

    @ViewChild('main') main: ElementRef;

    prev_markers: any = null;
    prev_map: any = null;
    count: number = 0;
    font_size: number = 1;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: any) {
        if(changes.markers) {
            this.setupMarkers();
        }
    }

    ngDoCheck() {
        if(!this.prev_map ||
            (this.map.pos.x !== this.prev_map.pos.x || this.map.pos.y !== this.prev_map.pos.y) ||
            (this.map.dim.x !== this.prev_map.dim.x || this.map.dim.y !== this.prev_map.dim.y)||
            (this.map.real_dim.x !== this.prev_map.real_dim.x || this.map.real_dim.y !== this.prev_map.real_dim.y)) {
                this.updateFontSize();
                this.prev_map = JSON.parse(JSON.stringify(this.map));
                setTimeout(() => {
                    this.updateMarkers();
                }, 200);
        }
    }

    updateFontSize() {
        let long = this.map.dim.x > this.map.dim.y ? this.map.dim.x : this.map.dim.y;
        this.font_size = this.map.dim.y / long;
    }

    setupMarkers() {
        if(!this.disable && this.markers) {
            this.count = this.markers.length;
            setTimeout(() => {
                for(let i = 0; i < this.markers.length; i++) {
                    let marker = this.markers[i];
                    if(!marker.x) marker.x = 0;
                    if(!marker.y) marker.y = 0;
                    this.markers[i].show = true;
                }
                this.updateMarkers();
            }, 200);
        }
    }

    updateMarkers() {
        if(!this.main || !this.markers) return;
        for(let i = 0;  i < this.markers.length; i++) {
            let marker = this.markers[i];
            let top = -(DIM_LIMIT+1);
            let left = -(DIM_LIMIT+1);
            let el = marker.el ? marker.el() : null;
            if(el){
                let bb = el.getBoundingClientRect();
                let abb = this.main.nativeElement.getBoundingClientRect();
                top = bb.top + bb.height/2 - abb.top;
                left = bb.left + bb.width/2 - abb.left;
            } else if(marker.x > 0 && marker.y > 0) {
                let x = marker.x;
                let y = marker.y;
                    // Handle map rotations
                let tmp = 0;
                switch(this.rotate) {
                    case 1:
                    case 90:
                        tmp= x; x = y; y = x;
                        x = this.map.dim.x - x;
                        break;
                    case 180:
                    case 2:
                        x = this.map.dim.x - x;
                        y = this.map.dim.y - y;
                        break;
                    case 270:
                    case 3:
                        tmp = x; x = y; y = tmp;
                        //x = this.map.dim.x - x;
                        y = this.map.dim.y - y;
                        break;
                }
                let r_x = x / this.map.dim.x * this.map.real_dim.x;
                let r_y = y / this.map.dim.y * this.map.real_dim.y;
                let abb = this.main.nativeElement.getBoundingClientRect();
                left = r_x + this.map.pos.x - abb.left;
                top = r_y + this.map.pos.y - abb.top;
            }
            if(top < -DIM_LIMIT || top > DIM_LIMIT || left < -DIM_LIMIT || left > DIM_LIMIT) {
                marker.show = false;
            } else {
                marker.top = top;
                marker.left = left;
            }
        }
    }
}
