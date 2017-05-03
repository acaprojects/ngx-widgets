/**
 * @Author: Alex Sorafumo <alex.sorafumo>
 * @Date:   09/01/2017 12:03 PM
 * @Email:  alex@yuion.net
 * @Filename: marker-group.component.ts
 * @Last modified by:   alex.sorafumo
 * @Last modified time: 16/01/2017 12:38 PM
 */

import { Component, ElementRef, Input, ViewChild } from '@angular/core';

const DIM_LIMIT = 20000;

@Component({
    selector: 'map-marker-group',
    templateUrl: './marker-group.template.html',
    styleUrls: ['./marker-group.styles.css'],
})
export class MapMarkerGroupComponent {
    @Input() public markers: any[] = [];
    @Input() public rotate: number = 0;
    @Input() public radius: number = 1;
    @Input() public disable: boolean = false;
    @Input() public reset: boolean = false;
    @Input() public map: any = {
        pos: { x: 0, y: 0 },
        dim: { x: 100, y: 100 },
        real_dim: { x: 100, y: 100 },
        area: { x: 100, y: 100 },
    };

    public count: number = 0;
    public font_size: number = 1;
    public radius_size: number = 12;

    @ViewChild('main') private main: ElementRef;

    private prev_map: any = null;
    private marker_timer: any = null;
    private prev_markers: string = '';

    constructor() {
        this.marker_timer = setInterval(() => {
            const markers = JSON.stringify(this.markers);
            if (this.prev_markers !== markers) {
                this.prev_markers = markers;
                this.updateMarkers();
            }
        }, 1000);
    }

    public ngOnChanges(changes: any) {
        if (changes.markers) {
            this.setupMarkers();
        }
    }

    public ngDoCheck() {
        if (!this.prev_map ||
            (this.map.pos.x !== this.prev_map.pos.x || this.map.pos.y !== this.prev_map.pos.y) ||
            (this.map.dim.x !== this.prev_map.dim.x || this.map.dim.y !== this.prev_map.dim.y) ||
            (this.map.real_dim.x !== this.prev_map.real_dim.x || this.map.real_dim.y !== this.prev_map.real_dim.y) ||
            (this.map.area.x !== this.prev_map.area.x || this.map.area.y !== this.prev_map.area.y)) {
                // Map box has changed update markers
                this.updateFontSize();
                this.prev_map = JSON.parse(JSON.stringify(this.map));
                setTimeout(() => {
                    this.updateMarkers();
                }, 200);
        }
    }

    public ngOnDestroy() {
        if (this.marker_timer) {
            clearTimeout(this.marker_timer);
        }
    }
    /**
     * Updates the size of the maker and its contents
     * @return {void}
     */
    private updateFontSize() {
        const long = this.map.dim.x > this.map.dim.y ? this.map.dim.x : this.map.dim.y;
        this.font_size = this.map.dim.y / long;
        const size = this.map.area.x * ( 2 / 100);
        this.radius_size = size;
    }
    /**
     * Creates the markers to be display
     * @return {void}
     */
    public setupMarkers() {
        if (!this.disable && this.markers) {
            this.count = this.markers.length;
            setTimeout(() => {
                for (let i = 0; i < this.markers.length; i++) {
                    const marker = this.markers[i];
                    if (!marker.x) marker.x = 0;
                    if (!marker.y) marker.y = 0;
                }
                this.updateMarkers();
            }, 200);
        }
    }
    /**
     * Updates the position of the markers
     * @return {void}
     */
    private updateMarkers() {
        if (!this.main || !this.markers) return;
        for (let i = 0;  i < this.markers.length; i++) {
            const marker = this.markers[i];
            if (!marker.show_fn) {
                marker.show = false;
                marker.show_fn = setTimeout(() => {
                    marker.show = true;
                }, 100);
            }
            let top = -(DIM_LIMIT + 1);
            let left = -(DIM_LIMIT + 1);
            const el = marker.el ? marker.el() : null;
            if (el) {
                const bb = el.getBoundingClientRect();
                const abb = this.main.nativeElement.getBoundingClientRect();
                top = bb.top + bb.height / 2 - abb.top;
                left = bb.left + bb.width / 2 - abb.left;
            } else if (marker.x > 0 && marker.y > 0) {
                let x = marker.x;
                let y = marker.y;
                    // Handle map rotations
                let tmp = 0;
                switch (this.rotate) {
                    case 1:
                    case 90:
                        tmp = x; x = y; y = tmp;
                        //y = this.map.dim.y - y;
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
                const r_x = x / this.map.dim.x * this.map.real_dim.x;
                const r_y = y / this.map.dim.y * this.map.real_dim.y;
                const abb = this.main.nativeElement.getBoundingClientRect();
                left = Math.round((r_x + this.map.pos.x - abb.left) * 100) / 100;
                top =  Math.round((r_y + this.map.pos.y - abb.top) * 100) /  100;
            }
            marker.top = top;
            marker.left = left;
        }
    }
}
