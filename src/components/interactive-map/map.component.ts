/**
 * @Author: Alex Sorafumo
 * @Date:   18/11/2016 4:31 PM
 * @Email:  alex@yuion.net
 * @Filename: map.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 31/01/2017 10:06 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, Pipe, Renderer, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { animate, group, keyframes, state, style, transition, trigger } from '@angular/core';

import { MapService } from '../../services';
import { Animate } from '../../services/animate.service';
import { WIDGETS } from '../../settings';
import { Utility } from '../../shared';

const ZOOM_LIMIT = 1000;
const FADE_TIME = 700;
const PADDING = 50;

@Component({
    selector: 'interactive-map',
    templateUrl: './map.template.html',
    styleUrls: ['./map.styles.css'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractiveMap {
    @Input() public map: string;
    @Input() public zoomMax: number = 200;
    @Input() public zoom: number = 0;
    @Input() public controls: boolean = true;
    @Input() public disable: string[] = [];
    @Input() public pins: any[] = [];
    @Input() public info: any[] = [];
    @Input() public mapSize: any = 100;
    @Input() public reset: any;
    @Input() public focus: any;
    @Input() public focusScroll: boolean = false;
    @Input() public focusZoom: number = 80;
    @Input() public padding: string = '2.0em';
    @Input() public color: string = '#000';
    @Input() public mapStyles: Array<{ id: string, color: string, fill: string, opacity: string }> = [];
    @Input() public rotations: number = 0;

    @Output() public tap = new EventEmitter();
    @Output() public zoomChange = new EventEmitter();
    @Output() public mapUpdated = new EventEmitter();

    public loading = true;
    public map_details: any = {
        pos: { x: 0, y: 0 },
        dim: { x: 100, y: 100 },
        real_dim: { x: 100, y: 100 },
        area: { x: 100, y: 100 },
    };
    public marker_list: any[] = [];
    public info_list: any[] = [];
    public map_data: any;
    public map_scale: number = 1;
    public reset_markers: boolean = false;
    public _zoom: number = 0; // As Percentage
    public info_update: boolean = false;

    @ViewChild('displayarea') private self: ElementRef;
    @ViewChild('maparea') private map_area: ElementRef;
    @ViewChild('mapdisplay') private map_display: ElementRef;

    private prev_map_styles: Array<{ id: string, color: string, fill: string, opacity: string }> = [];
    private map_style_ids: string[] = [];
    private content_box: any;
    private map_box: any;
    private map_item: any;
    private rotate: number = 0; // In degrees
    private map_orientation: string = '';
    private active = false;
    private min = 20;
    private isFocus = false;
    private center: any = { x: 0.5, y: 0.5 };

    private redraw: any = null;
    private rezoom: any = null;
    private status_check: any = null;
    private zoom_bb: any = null;
    private move_timer: any = null;
    private prev_styles: string = null;
    private timers: any = {};

    private delta: any = { x: 0, y: 0, zoom: 1 };

    private prev_height: number = -999;
    private prev_zoom: number = -999;

    private move = {
        x: 0,
        y: 0,
    };

    constructor(
        private a: Animate, private service: MapService, private renderer: Renderer,
        private cdr: ChangeDetectorRef, private zone: NgZone
    ) {
        this.status_check = setInterval(() => {
            this.checkStatus();
        }, 1000);
        const defaults = service.defaults;
        for (const i in defaults) {
            if (i in this) {
                this[i] = defaults[i];
            }
        }
        this.initAnimations();
    }

    public ngOnInit() {
        this.checkStatus();
        this.refresh();
    }

    public ngOnChanges(changes: any) {
        if (changes.map) {
            this._zoom = 0;
            this.center = { x: 0.5, y: 0.5 };
            this.loadMapData();
        }
        if (changes.zoom && this.zoom !== this._zoom) {
            this._zoom = this.zoom;
            this.rezoom.animate();
        }
        if (changes.disable) {
            const pv = changes.disable.previousValue;
            if (pv !== null && pv !== undefined) {
                this.clearDisabled(pv);
            }
            this.setupDisabled();
        }
        if (changes.pins && this.pins) {
            this.initPins();
        }
        if (changes.info && this.info) {
            this.initInfo();
        }
        if (changes.reset) {
            this.resetZoom();
        }
        if (changes.focus) {
            setTimeout(() => {
                this._zoom = 0;
                this.zoom = 0;
                this.zoomChange.emit(0);
                if (this.focus && this.focus !== '') {
                    this.updateFocus();
                }
            }, 100);
        }
    }

    public ngDoCheck() {
        // Check if the pins have changed
        if (this.marker_list && this.marker_list.length !== this.pins.length) {
            if (this.marker_list.length > this.pins.length) {
                this.marker_list.splice(this.pins.length - 1, this.marker_list.length - this.pins.length);
            }
            this.initPins();
        }
        // Check if the pins have changed
        if (this.info_list && this.info_list.length !== this.info.length) {
            if (this.info_list.length > this.info.length) {
                this.info_list.splice(this.info.length - 1, this.info_list.length - this.info.length);
            }
            this.initInfo();
        }
        const styles = this.mapStyles ? JSON.stringify(this.mapStyles) : '';
        if (this.mapStyles && styles !== this.prev_styles) {
            this.prev_styles = styles;
            this.setupStyles();
        }
    }

    public ngOnDestroy() {
        if (this.status_check) {
            clearInterval(this.status_check);
        }
    }

    public change() {
        this.cdr.markForCheck();
    }

    public refresh() {
        this.redraw.animate();
        this.rezoom.animate();
    }
    /**
     * Checks the zoom and position values and makes sure that they are within the set bounds
     * @param  {boolean = false} force Forces the checking of values when item is focused on
     * @return {void}
     */
    public checkValues(force: boolean = false) {
        if (!this.isFocus || force) {
            // Check zoom is valid
            if (this._zoom > this.zoomMax || this._zoom > ZOOM_LIMIT) {
                this._zoom = this.zoomMax;
            } else if (this._zoom < -50) {
                this._zoom = -50;
            } else if (!this._zoom) {
                this._zoom = 0;
            }
            this.zoomChange.emit(this._zoom);
            this.rotate = this.rotate % 360;
            // Check position is valid
            if (this.center.x < 0) {
                this.center.x = 0;
            } else if (this.center.x > 1) {
                this.center.x = 1;
            }

            if (this.center.y < 0) {
                this.center.y = 0;
            } else if (this.center.y > 1) {
                this.center.y = 1;
            }
        }
    }
    /**
     * Checks if the map exists withing the DOM and is visible on the DOM
     * @param {number} tries Counter for the number of attempts to check the status
     * @return {void}
     */
    public checkStatus(tries: number = 0) {
        if (tries > 2) {
            return;
        }
        let visible = false;
        if (!this.self) {
            let el = this.self.nativeElement;
            while (el) {
                if (el.nodeName === 'BODY') {
                    visible = true;
                    break;
                }
                el = el.parentNode;
            }
            if (visible) {
                visible = this.isVisible();
            }
            if (!visible) {
                this.active = false;
                this.loading = true;
                // setTimeout(() => { this.checkStatus(tries+1); }, 50);
            } else {
                if (this.active !== visible) {
                    this.active = true;
                    setTimeout(() => {
                        this.loadMapData();
                    }, 100);
                }
            }
        }
    }
    /**
     * Called when map is tapped/clicked
     * @param {any} event Input Event
     */
    public tapMap(event: any) {
        // Traverse map and return array of clicked elements
        let elems: any[] = [];
        const el = this.map_item;
        if (event && this.map_display) {
            const mbb = this.map_display.nativeElement.getBoundingClientRect();
            if (WIDGETS.get('debug')) {
                const c = event.center;
                const left = c.x - mbb.left;
                const top = c.y - mbb.top;
                const ratio = { x: +((left / mbb.width).toFixed(3)), y: +((top / mbb.height).toFixed(3)) };
                let tmp = 0;
                const dim = JSON.parse(JSON.stringify(this.map_details.dim));
                switch (this.rotations) {
                    case 1:
                    case 90:
                        tmp = ratio.x; ratio.x = ratio.y; ratio.y = tmp;
                        tmp = dim.x; dim.x = dim.y; dim.y = tmp;
                        ratio.y = 1 - ratio.y;
                        break;
                    case 2:
                    case 180:
                        ratio.y = 1 - ratio.y;
                        ratio.x = 1 - ratio.x;
                        break;
                    case 3:
                    case 270:
                        tmp = ratio.x; ratio.x = ratio.y; ratio.y = tmp;
                        tmp = dim.x; dim.x = dim.y; dim.y = tmp;
                        ratio.x = 1 - ratio.x;
                        break;
                }
                const posX = ratio.x * dim.x;
                const posY = ratio.y * dim.y;
                const real_pos = `${left.toFixed(2)}, ${top.toFixed(2)}`;
                const map_pos = `${posX.toFixed(0)}, ${posY.toFixed(0)}`;
                WIDGETS.log('MAP(C)', `Tapped: ${real_pos}(${map_pos})`);
            }
        }
        // Get list of element ids that the user has clicked on
        elems = this.getItems(event.center, el);
        const e = {
            items: elems,
            event,
        };
        console.log(e);
        this.checkInfoTap(e);
        this.tap.emit(e);
    }

    /**
     * Updates the map position based off of user input
     * @param  {any} event Input Event
     * @return {void}
     */
    public moveMap(event: any) {
        if (this.move_timer) {
            this.move.x = event.deltaX;
            this.move.y = event.deltaY;
            clearTimeout(this.move_timer);
            this.move_timer = null;
        }
        if (this.move.x === 0) {
            this.move.x = +event.deltaX;
        }
        if (this.move.y === 0) {
            this.move.y = +event.deltaY;
        }
        let dX = +event.deltaX - +this.move.x;
        dX = (Math.min(this.min, +Math.abs(dX)) * (dX < 0 ? -1 : 1));
        let dY = +event.deltaY - +this.move.y;
        dY = (Math.min(this.min, +Math.abs(dY)) * (dY < 0 ? -1 : 1));

        this.updatePosition(-(dX / this.map_box.width), -(dY / this.map_box.height));
        this.move.x = event.deltaX;
        this.move.y = event.deltaY;
        if (this.min < 100) {
            this.min += 10;
        }
    }
    /**
     * Increases the zoom level of the map by 20%
     * @return {void}
     */
    public zoomIn() {
        this.updateZoom(1.2);
    }
    /**
     * Decreases the zoom level of the map by 20%
     * @return {void}
     */
    public zoomOut() {
        this.updateZoom(0.8);
    }
    /**
     * Resets the zoom level of the map and centers the map on the screen
     * @return {void}
     */
    public resetZoom() {
        this.center = { x: 0.5, y: 0.5 };
        this.updateZoom(0, 100);
        this.updatePosition(0.001, 0.001);
    }
    /**
     * Generate a value that moves in a direction of A to B
     * @param {number}    from Starting position
     * @param {number}    to   Ending position
     * @param {number =    50}          max Max value of movement from A to B
     * @return {number} Returns value for moving from A towards B
     */
    public moveTo(from: number, to: number, max: number = 50) {
        const dir = from - to < 0 ? 1 : -1;
        return dir * Math.min(Math.abs(from - to), max);
    }
    /**
     * Finalises the map position based off of user input
     * @param  {any} event Input Event
     * @return {void}
     */
    public moveEnd(event: any) {
        if (this.move_timer) {
            clearTimeout(this.move_timer);
            this.move_timer = null;
        }
        this.move_timer = setTimeout(() => {
            this.move.x = this.move.y = 0;
            this.min = 1;
            if (this.map_area && this.map_item){
                this.renderer.setElementStyle(this.map_area, 'will-change', '');
                this.renderer.setElementStyle(this.map_item, 'will-change', '');
            }
            setTimeout(() => {
                if (this.map_area && this.map_item){
                    this.renderer.setElementStyle(this.map_area, 'will-change', 'transform');
                    this.renderer.setElementStyle(this.map_item, 'will-change', 'transform');
                }
            }, 200);
        }, 20);
    }
    /**
     * Initialised the updating of the map zoom level based off of user input
     * @param  {any} event Input Event
     * @return {void}
     */
    public startScale(event: any) {
        this.delta.zoom = event.scale;
    }
    /**
     * Updates the map zoom level based off of user input
     * @param  {any} event Input Event
     * @return {void}
     */
    public scaleMap(event: any) {
        const scale = event.scale - this.delta.zoom;
        const dir = scale > 0 ? 1 : -1;
        const value = 1 + dir * Math.max(Math.abs(scale), 0.01) / 2;
        this.updateZoom(value);
        this.delta.zoom += scale;
    }
    /**
     * Finalises the map zoom level based off of user input
     * @param  {any} event Input Event
     * @return {void}
     */
    public finishScale() {
        this.delta.zoom = 0;
        setTimeout(() => {
            this.zoomChange.emit(this._zoom);
        }, 100);
    }

    /**
     * Called when the window resizes, updates focus and bounding boxes
     * @return {void}
     */
    public resize() {
        if (!this.self) {
            return;
        }
        this.refresh();
        this.loading = false;
    }

    private checkInfoTap(e: any) {
        for (const itm of this.info_list) {
            if (e.items.indexOf(itm.id) >= 0) {
                itm.show = !itm.show;
            }
        }
        /*
        this.info_list = JSON.parse(JSON.stringify(this.info_list));
        for (const itm of this.info_list) {
            itm.el = () => {
                return this.getElement(itm.id);
            }
        }
        // */
        this.info_update = !this.info_update;
        this.change();
    }
    /**
     * Clears the list of disabled elements with the map
     * @param  {string[]} strs List of element IDs that are disabled
     * @return {void}
     */
    private clearDisabled(strs: string[]) {
        if (this.map_display) {
            for (const str of strs) {
                const el = this.getElement(str);
                if (el !== null) {
                    this.renderer.setElementStyle(el, 'display', 'inherit');
                }
            }
        }
    }
    /**
     * Hides elements inside the map with the given IDs
     * @return {void}
     */
    private setupDisabled() {
        if (this.active && this.map_display) {
            for (const item of this.disable) {
                const el = this.getElement(item);
                if (el !== null) {
                    this.renderer.setElementStyle(el, 'display', 'none');
                }
            }
        }
    }
    /**
     * Alters the styling of the elements with the given IDs
     * @return {void}
     */
    private setupStyles() {
        if (!this.map_display) {
            setTimeout(() => {
                this.setupStyles();
            }, 500);
            return;
        }
        // Clear previous style changes
        if (this.prev_map_styles && this.prev_map_styles.length > 0) {
            for (const style of this.prev_map_styles) {
                const el = this.getElement(style.id);
                if (el) {
                    for (const s in style) {
                        if (s in el.style) {
                            this.renderer.setElementStyle(el, s, style[s]);
                            el.style[s] = style[s];
                        }
                    }
                }
            }
        }
        if (!this.mapStyles || !this.map_item) {
            return;
        }
        for (const style of this.mapStyles) {
            const el = this.getElement(style.id);
            if (el && style.id !== '') {
                const old_style = JSON.parse(JSON.stringify(style));
                for (const s in style) {
                    if (s in el.style) {
                        old_style[s] = el.style[s];
                        this.renderer.setElementStyle(el, s, style[s]);
                    }
                }
                if (this.map_style_ids.indexOf(style.id) < 0) {
                    this.prev_map_styles.push(old_style);
                    this.map_style_ids.push(style.id);
                }
            }
        }
        this.change();
    }
    /**
     * Removes all the pins from the map
     * @return {void}
     */
    private clearPins() {
        this.pins = [];
    }
    /**
     * Checks if the interactive map is visisble on the DOM
     * @return {void}
     */
    private isVisible() {
        if (this.self) {
            // Check if the map area is visiable
            const bb = this.self.nativeElement.getBoundingClientRect();
            const body = this.renderer.selectRootElement('body');
            if (bb.left + bb.width < 0) {
                return false;
            } else if (bb.top + bb.height < 0) {
                return false;
            } else if (bb.top > body.innerHeight) {
                return false;
            } else if (bb.left > body.innerWidth) {
                return false;
            }

            return true;
        }
        return false;
    }
    /**
     * Performs the initial setup of pins and focusing when a map is loaded
     * @return {void}
     */
    private setupEvents() {
        this.initPins();
        this.initInfo();
        if (this.focus) {
            this.updateFocus();
        }
    }
    /**
     * Initialise the pins displayed on the map
     * @return {void}
     */
    private initPins() {
        const markers = JSON.parse(JSON.stringify(this.marker_list));
        for (let i = 0; i < this.pins.length; i++) {
            if (i < markers.length && markers[i]) {
                markers[i] = JSON.parse(JSON.stringify(this.pins[i]));
            } else {
                markers.push(JSON.parse(JSON.stringify(this.pins[i])));
            }
            if (markers[i].id && markers[i].id !== '') {
                markers[i].el = () => {
                    return this.getElement(markers[i].id);
                };
            }
        }
        this.marker_list = markers;
        this.change();
    }

    private initInfo() {
        const regions = [];
        for (const rgn of this.info) {
            if (rgn.id) {
                rgn.el = () => {
                    return this.getElement(rgn.id);
                }
                rgn.show = false;
            }
            regions.push(rgn);
        }
        this.info_list = regions;
        this.change();
    }
    /**
     * Gets the element with the given ID from the map
     * @param {string} id Element ID
     * @return {ElementRef}
     */
    private getElement(id: string) {
        if (this.map_display) {
            return this.map_display.nativeElement.querySelector('#' + Utility.escape(id));
        } else {
            return null;
        }
    }
    /**
     * Updates to element focused in on the map
     * @param  {number} tries Number of retry attempts
     * @return {void}
     */
    private updateFocus(tries: number = 0) {
        if (!this.map_display || !this.map_data) {
            return;
        }
        if (this.focus === null || this.focus === undefined || this.focus === '') {
            return;
        }
        this.zoomMax = 2000;
        if (this.map_item && this.map_area) {
            const bb = this.getFocusBB();
            if (bb) {
                this.zoomFocus(bb);
            } else {
                this.retryFocus(tries);
            }
        } else {
            this.retryFocus();
        }
    }
    /**
     * Zooms into the focused item
     * @param {any} bb Focused element bounding box
     * @return {void}
     */
    private zoomFocus(bb: any) {
        if (!this.map_item || !this.map_area) {
            return;
        }
        const cbb = this.map_item.getBoundingClientRect();
        const mbb = this.map_area.nativeElement.getBoundingClientRect();
        if (cbb && mbb && bb) {
            this.zoom_bb = bb;
            setTimeout(() => {
                const w_ratio = mbb.width / bb.width * (cbb.width / mbb.width);
                const h_ratio = mbb.height / bb.height * (cbb.height / mbb.height);
                const r = (w_ratio < h_ratio ? w_ratio : h_ratio) * (typeof this.focus === 'string' ? 0.5 : 1.5);
                this._zoom = (this.focusZoom);
                this.zoom = this._zoom;
                this.zoomChange.emit(this._zoom);
                this.isFocus = true;
                this.rezoom.animate();
            }, 20);
        }
    }
    /**
     * Timeout for retrying to focus on a map item
     * @param  {number} tries Number of retry attempts
     * @return {void}
     */
    private retryFocus(tries: number = 0) {
        if (tries > 10) {
            return;
        }
        setTimeout(() => {
            this.updateFocus(++tries);
        }, 100);
    }
    /**
     * Get the bounding box of the focused item or location
     * @return {any} Bounding box of the item or location
     */
    private getFocusBB() {
        if (this.focus && typeof this.focus === 'string' && this.focus !== '') {
            const el = this.getElement(this.focus);
            if (el !== null) {
                this.zoom_bb = el.getBoundingClientRect();
            }
        } else if (this.focus && typeof this.focus === 'object') {
            if (!this.map_item || !this.map_area) {
                return;
            }
            if (this.focus.x > 0 && this.focus.y > 0) {
                // Get content bounding boxes
                const cbb = this.map_area.nativeElement.getBoundingClientRect();
                const mb = this.map_item.getBoundingClientRect();
                // Get point position
                const dir = this.map_box ? (mb.width > mb.height) : true;
                const map_x = Math.ceil(dir ? this.mapSize : (this.mapSize * (mb.width / mb.height)));
                const map_y = Math.ceil(!dir ? this.mapSize : (this.mapSize * (mb.height / mb.width)));

                const f_x = (this.focus.y ? Math.min(map_y, this.focus.y) / map_y : mb.width / mb.height) * mb.height;
                const p_y = Math.round(f_x);
                const p_x = Math.round((this.focus.x ? Math.min(map_x, this.focus.x) / map_x : 1) * mb.width);
                // Get bounding rectangle of pin location
                const ccbb = {
                    width: 128, height: 128,
                    left: p_x + (mb.left - cbb.left) + cbb.left,
                    top: p_y + (mb.top - cbb.top) + cbb.top,
                };
                this.zoom_bb = ccbb;
            }
        }
        return this.zoom_bb;
    }
    /**
     * Finished the focusing position by updating the map zoom and updating the bounding boxes
     * @return {void}
     */
    private finishFocus(tries: number = 0) {
        this.isFocus = false;
        if (!this.map_item || !this.map_area) {
            if (tries < 10) {
                setTimeout(() => {
                    this.finishFocus(++tries);
                }, 200);
            }
            return;
        }
        // Get content bounding boxes
        const cbb = this.map_area.nativeElement.getBoundingClientRect();
        const mbb = this.map_item.getBoundingClientRect();
        const coord = typeof this.focus === 'object' && this.focus.x && this.focus.y;
        this.getFocusBB();
        const bb = this.zoom_bb;
        const x = bb.left + bb.width / 2 - mbb.left;
        const y = bb.top + bb.height / 2 - mbb.top;
        this.focusOnPoint(x, y);
        this.zoom_bb = null;

        setTimeout(() => {
            this.zoomChange.emit(this._zoom);
        }, 100);
    }
    /**
     * Sets the given point as the center of the display of the map
     * @param  {number} x X coordinate in the map
     * @param  {number} y Y coordinate in the map
     * @return {void}
     */
    private focusOnPoint(x: number, y: number, tries: number = 0) {
        if (!this.map_item) {
            if (tries < 10) {
                setTimeout(() => {
                    this.focusOnPoint(x, y, ++tries);
                }, 200);
            }
            return;
        }
        const mbb = this.map_item.getBoundingClientRect();
        const r_x = x / mbb.width;
        const r_y = y / mbb.height;
        this.updatePosition(r_x - this.center.x, r_y - this.center.y);
    }
    /**
     * Gets the map data from the set file
     * @return {void}
     */
    private loadMapData() {
        this.loading = true;
        setTimeout(() => {
            this.map_data = null;
            if (this.map_display) {
                const m_el = this.map_display.nativeElement;
                this.renderer.setElementProperty(m_el, 'innerHTML', '');
                if (this.map && this.map.indexOf('.svg') >= 0 && this.map.length > 4) {
                    this.service.getMap(this.map).then((data: any) => {
                        this.map_data = data;
                        this.setupMap();
                    }, (err: any) => {
                        WIDGETS.log(`Map(C)`, `Error loading map "${this.map}".`, err, 'warn');
                    });
                } else {
                    if (!this.map) {
                        WIDGETS.log(`Map(C)`, `Path to map is not valid.`, null, 'warn');
                    } else if (this.map.indexOf('.svg') < 0) {
                        WIDGETS.log(`Map(C)`, `Path to map is not an SVG.`, null, 'warn');
                    } else if (this.map.length > 4) {
                        const msg = `Path to map is not long enough. It needs to be longer than 4 characters`;
                        WIDGETS.log(`Map(C)`, msg, null, 'warn');
                    } else {
                        WIDGETS.log(`Map(C)`, `Unknown error loading map with map path "${this.map}".`, null, 'warn');
                    }
                }
            } else {
                setTimeout(() => {
                    this.loadMapData();
                }, 200);
            }
        }, FADE_TIME);
    }
    /**
     * Injects map data into the DOM and sets pins, disabled elements and styling.
     * @return {void}
     */
    private setupMap() {
        this.loading = true;
        if (this.map_data && this.map_display) {
            const m_el = this.map_display.nativeElement;
            m_el.innerHTML = this.map_data;
            this.renderer.setElementProperty(m_el, 'innerHTML', this.map_data);
            this.map_item = this.map_display.nativeElement.children[0];
            this.renderer.setElementStyle(this.map_item, this.map_orientation, '100%');
            this.renderer.setElementStyle(this.map_item, 'position', 'absolute');
            this.renderer.setElementStyle(this.map_item, 'top', '50%');
            this.renderer.setElementStyle(this.map_item, 'left', '50%');
            if (this.map_area && this.map_area.nativeElement && this.map_item && this.map_item.nativeElement){
                this.renderer.setElementStyle(this.map_area.nativeElement, 'will-change', 'transform');
                this.renderer.setElementStyle(this.map_item.nativeElement, 'will-change', 'transform');
            }
            this.setupDisabled();
            this.prev_map_styles = [];
            this.map_style_ids = [];
            this.setupStyles();
            this.setupEvents();
            this.updateFocus();
            this.marker_list = [];
            this.initPins();
            this.initInfo();
            setTimeout(() => {
                this.loading = false;
                this.mapUpdated.emit();
                this.delta = { x: 0.0001, y: 0.0001 };
                this.animatePosition();
                this.refresh();
                this.change();
            }, 500);
        }
    }
    /**
     * Recusively gets the list of element IDs withing the given position
     * @param  {any} pos Position of the point to check elements contain
     * @param  {any} el  Element whose children to check
     * @return {void}
     */
    private getItems(pos: any, el: any) {
        let elems: any[] = [];
        const children = el.children || el.childNodes;
        if (el && children) {
            for (const elem of children) {
                const rect = elem.getBoundingClientRect();
                if (pos.y >= rect.top && pos.y <= rect.top + rect.height &&
                    pos.x >= rect.left && pos.x <= rect.left + rect.width) {
                    if (elem.id) {
                        elems.push(elem.id);
                    }
                    const celems = this.getItems(pos, elem);
                    elems = elems.concat(celems);
                }
            }
        }
        return elems;
    }

    private initAnimations() {
        this.redraw = this.a.animation(() => {
            this.checkValues(true);
        }, () => {
            this.animatePosition();
            this.timers.redraw = null;
            setTimeout(() => {
                this.updateMapDetails();
            }, 50);
        });
        this.rezoom = this.a.animation(() => {
            this.checkValues(true);
        }, () => {
            this.animateZoom();
            setTimeout(() => {
                this.updateBoxes();
            }, 300);
        });
    }

    private animatePosition() {
        if (this.delta && (this.delta.x !== 0 || this.delta.y !== 0)) {
            if (this.delta.x) {
                this.center.x += this.delta.x;
            }
            if (this.delta.y) {
                this.center.y += this.delta.y;
            }
            this.checkValues();
            if (this.center && this.center.x && this.center.y) {
                const x = -(Math.floor(this.center.x * 10000) / 100);
                const y = -(Math.floor(this.center.y * 10000) / 100);
                if (this.map_item) {
                    this.renderer.setElementStyle(this.map_item, 'transform', `translate(${x}%, ${y}%)`);
                }
            }
        }
        this.delta.x = 0;
        this.delta.y = 0;
    }

    private animateZoom() {
        const scale = Math.round((1 / this.map_scale) * 1000) / 1000;
        const m_el = this.map_display.nativeElement;
        const zoom_scale = ((100 + this._zoom) / 100) * (scale);
        const transform = `translate(-50%, -50%) scale(${zoom_scale})`;
        this.renderer.setElementStyle(m_el, 'transform', transform);
        if (this.isFocus) {
            this.finishFocus();
        }
    }
    /**
     * Updates map dimentional information for use with the map pins/markers
     * @return {void}
     */
    private updateMapDetails() {
        if (!this.map_item || !this.map_area) {
            return;
        }
        const mbb = this.map_item.getBoundingClientRect();
        const abb = this.map_area.nativeElement.getBoundingClientRect();

        const dir = this.map_box ? (mbb.width > mbb.height) : true;

        const details: any = {
            pos: { // Position
                x: mbb.left,
                y: mbb.top,
            },
            dim: { // Dimensions
                x: Math.ceil(dir ? this.mapSize : (this.mapSize * (mbb.width / mbb.height))),
                y: Math.ceil(!dir ? this.mapSize : (this.mapSize * (mbb.height / mbb.width))),
            },
            real_dim: { // Real dimensions
                x: mbb.width,
                y: mbb.height,
            },
            area: { // Map area dimensions
                x: abb.width,
                y: abb.height,
            },
        };
        this.map_details = details;
    }
    /**
     * Updates the position of the map
     * @param  {number} xp New X position
     * @param  {number} yp New Y position
     * @return {void}
     */
    private updatePosition(dx: number, dy: number) {
        this.delta.x += dx;
        this.delta.y += dy;
        this.redraw.animate();
    }
    /**
     * Updates the zoom level of the map and redraws the map
     * @param  {number} zp  Percentage to modify the map by
     * @param  {number} add Flat value to add to the zoom
     * @return {void}
     */
    private updateZoom(zp: number, add: number = 0) {
        this._zoom = Math.round((this._zoom + 100) * zp - 100 + add);
        this.rezoom.animate();
    }
    /**
     * Updates the bounding boxes of the map container and the map inside
     * @return {void}
     */
    private updateBoxes() {
        if (!this.content_box && this.self) {
            this.content_box = this.self.nativeElement.getBoundingClientRect();
        }
        if (this.map_display && this.content_box && this.map_item) {
            // this.map_box = this.map_display.nativeElement.getBoundingClientRect();
            this.map_box = this.map_item.getBoundingClientRect();
            this.zoomChange.emit(this._zoom);
            const x = (this.map_box.width - this.content_box.width) / this.map_box.width;
            const y = (this.map_box.height - this.content_box.height) / this.map_box.height;
            if (this.prev_height !== this.map_box.height) {
                const m_s = this.map_box.width / this.map_box.height;
                const c_s = this.content_box.width / this.content_box.height;
                this.map_scale = Math.round((c_s / m_s) * 100) / 100;
                if (this.map_scale < 1) {
                    this.map_scale = 1;
                }
                this.prev_height = this.map_box.height;
                this.prev_zoom = this._zoom;
            }
            this.updateMapDetails();
        }
        if (!this.self || !this.map_box || !this.content_box) {
            setTimeout(() => {
                this.updateBoxes();
            }, 200);
        }
    }

}
