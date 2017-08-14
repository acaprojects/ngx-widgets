/**
 * @Author: Alex Sorafumo <alex.sorafumo>
 * @Date:   09/01/2017 12:03 PM
 * @Email:  alex@yuion.net
 * @Filename: region-group.component.ts
 * @Last modified by:   alex.sorafumo
 * @Last modified time: 16/01/2017 12:38 PM
 */

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

const DIM_LIMIT = 20000;

@Component({
    selector: 'map-info-group',
    templateUrl: './info-display-group.template.html',
    styleUrls: ['./info-display-group.styles.css'],
})
export class MapInfoDisplayGroupComponent {
    @Input() public regions: any[] = [];
    @Input() public rotate: number = 0;
    @Input() public radius: number = 1;
    @Input() public disable: boolean = false;
    @Input() public reset: boolean = false;
    @Input() public update: boolean = false;
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
    private region_timer: any = null;
    private prev_regions: string = '';

    public ngOnChanges(changes: any) {
        if (changes.regions) {
            this.setupRegions();
        }
    }

    public ngDoCheck() {
        if (!this.prev_map ||
            (this.map.pos.x !== this.prev_map.pos.x || this.map.pos.y !== this.prev_map.pos.y) ||
            (this.map.dim.x !== this.prev_map.dim.x || this.map.dim.y !== this.prev_map.dim.y) ||
            (this.map.real_dim.x !== this.prev_map.real_dim.x || this.map.real_dim.y !== this.prev_map.real_dim.y) ||
            (this.map.area.x !== this.prev_map.area.x || this.map.area.y !== this.prev_map.area.y)) {
                // Map box has changed update regions
                this.updateFontSize();
                this.prev_map = JSON.parse(JSON.stringify(this.map));
                setTimeout(() => {
                    this.updateRegions();
                }, 200);
        }
    }

    /**
     * Creates the regions to be display
     * @return {void}
     */
    public setupRegions() {
        if (!this.disable && this.regions) {
            this.count = this.regions.length;
            setTimeout(() => {
                for (const region of this.regions) {
                    if (!region.x) {
                        region.x = 0;
                    }
                    if (!region.y) {
                        region.y = 0;
                    }
                }
                this.updateRegions();
            }, 200);
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
     * Updates the position of the regions
     * @return {void}
     */
    private updateRegions() {
        if (!this.main || !this.regions) {
            return;
        }
        for (const region of this.regions) {
            let top = -(DIM_LIMIT + 1);
            let left = -(DIM_LIMIT + 1);
            const el = region.el ? region.el() : null;
            if (el) {
                const bb = el.getBoundingClientRect();
                const abb = this.main.nativeElement.getBoundingClientRect();
                top = bb.top - abb.top;
                left = bb.left + bb.width / 2 - abb.left;
            } else if (region.x > 0 && region.y > 0) {
                let x = region.x;
                let y = region.y;
                    // Handle map rotations
                let tmp = 0;
                switch (this.rotate) {
                    case 1:
                    case 90:
                        tmp = x; x = y; y = tmp;
                        // y = this.map.dim.y - y;
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
                        // x = this.map.dim.x - x;
                        y = this.map.dim.y - y;
                        break;
                }
                const r_x = x / this.map.dim.x * this.map.real_dim.x;
                const r_y = y / this.map.dim.y * this.map.real_dim.y;
                const abb = this.main.nativeElement.getBoundingClientRect();
                left = Math.round((r_x + this.map.pos.x - abb.left) * 100) / 100;
                top =  Math.round((r_y + this.map.pos.y - abb.top) * 100) /  100;
            }
            region.top = top;
            region.left = left;
        }
    }
}
