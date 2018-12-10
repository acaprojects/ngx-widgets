import { Directive, Input, Output, EventEmitter, HostListener, Renderer2 } from "@angular/core";

import { BaseWidgetComponent } from "../../../shared/base.component";
import { MapService } from "../../../services/map.service";

import { IMapPoint } from "./map-renderer/map-renderer.component";
import { IMapPointOfInterest } from "./map.component";
import { MapUtilities } from "./map.utilities";

export interface IMapListener {
    id: string;
    selector: string;
    event: string;
    callback: Function;
}

@Directive({
    selector: '[aca-map-input]',
})
export class MapInputDirective extends BaseWidgetComponent {
    @Input() public scale: number;
    @Input() public center: IMapPoint;
    @Input() public listeners: IMapListener[];
    @Input() public focus: IMapPointOfInterest;
    @Input() public map: Element;
    @Output() public scaleChange = new EventEmitter();
    @Output() public centerChange = new EventEmitter();
    @Output() public event = new EventEmitter();

    private model: any = {};

    constructor(private service: MapService, private renderer: Renderer2) {
        super();
    }

    public ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
        if (changes.scale || changes.center) {
            this.changePosition(!!changes.scale);
        }
        if (changes.map && this.map) {
            this.update();
        }
        if (changes.listeners) {
            this.updateListeners();
        }
        if (changes.focus) {
            this.focusItem();
        }
    }

    /**
     * Start of move event
     * @param e
     */
    @HostListener('panstart', ['$event']) public moveStart(e) {
        this.model.target = e.target;
        this.model.dx = e.center.x;
        this.model.dy = e.center.y;
    }

    /**
     * Move event
     * @param e
     */
    @HostListener('panmove', ['$event']) public move(e) {
        const scale = this.scale || 1;
        const dx = e.center.x - this.model.dx;
        const dy = e.center.y - this.model.dy;
        const center = this.center || { x: .5, y: .5 }
        const delta_x = +(dx / this.model.map_box.width).toFixed(4) / scale * 1.5;
        const delta_y = +(dy / this.model.map_box.height).toFixed(4) / scale * 1.5;
        this.model.center = { x: center.x - delta_x, y: center.y - delta_y };
        this.changePosition();
        this.model.dx = e.center.x;
        this.model.dy = e.center.y;
    }

    @HostListener('wheel', ['$event']) public wheelZoom(e) {
        e.preventDefault();
        this.model.scale = this.scale || 1;
        this.model.scale *= e.wheelDelta > 0 ? 1.05 : (e.wheelDelta < 0 ? (1 / 1.05) : 1);
        this.check();
        this.scale = this.model.scale;
        this.scaleChange.emit(this.scale);
    }

    @HostListener('pinchstart', ['$event']) public pinchStart(e) {
        this.model.dz = e.scale;
        const box = this.model.map_box;
        const dist = Math.sqrt(box.width * box.width + box.height * box.height);
        const width = e.pointers[0].clientX - e.pointers[1].clientX;
        const height = e.pointers[0].clientY - e.pointers[1].clientY;
        const pinch_dist = Math.sqrt(width * width + height * height);
        this.model.in = 10 * (pinch_dist / dist);
    }

    @HostListener('pinchmove', ['$event']) public pinchZoom(e) {
        e.preventDefault();
        const dz = e.scale - this.model.dz;
        this.model.scale = this.scale || 1;
        this.model.scale += this.model.in > 1 ? dz * this.model.in : dz;
        this.check();
        this.scale = this.model.scale;
        this.scaleChange.emit(this.scale);
        this.model.dz = e.scale;
    }

    /**
     * Focus on the given point of interest
     */
    public focusItem() {
        if (this.focus && (this.focus.id || this.focus.coordinates)) {
            if (!this.map) {
                return this.timeout('focus', () => this.focusItem());
            }
            const selector = this.focus.id ? `#${MapUtilities.cleanCssSelector(this.focus.id)}` : ''
            const el = this.focus.id ? this.map.querySelector(selector) : null;
            if (el) { // Focus on element
                const box = el.getBoundingClientRect();
                const map_box = this.map.getBoundingClientRect();
                this.model.center = {
                    x:  ((box.left + box.width / 2) - map_box.left) / map_box.width,
                    y:  ((box.top + box.height / 2) - map_box.top) / map_box.height
                };
                this.model.scale = this.focus.zoom ? this.focus.zoom / 100 : MapUtilities.getFillScale(map_box, box) * .6;
                this.changePosition(true)
            } else if (this.focus.coordinates) { // Focus on coordinates
                const pnt = this.focus.coordinates;
                const ratio = this.model.map_box.width / this.model.map_box.height;
                this.model.center = { x: pnt.x / 10000, y: pnt.y / (10000 * ratio) };
                this.model.scale = this.focus.zoom ? this.focus.zoom / 100 : 1;
                this.changePosition(true);
            }
        }
    }

    /**
     * Update bounding box of map
     */
    public update() {
        if (this.map) {
            this.model.map_box = this.map.getBoundingClientRect();
            if (this.model.map_box.height === 0 || this.model.map_box.width === 0) {
                return this.timeout('update_fail', () => this.update());
            }
            this.model.zoom = 100;
            this.model.position = { x: .5, y: .5 };
            // this.renderer.setStyle(this.map, 'pointer-events', 'auto');
            // this.renderer.listen(this.map, 'click', (e) => {
            //     const box = this.map.getBoundingClientRect();
            //     console.log('Clicked:', {
            //         x: `${((e.clientX - box.left) / box.width * 100).toFixed(3)}%`,
            //         y: `${((e.clientY - box.top) / box.height * 100).toFixed(3)}%`
            //     });
            // })
            if (this.focus) {
                this.focusItem();
            } else {
                this.changePosition(true);
            }

        }
    }

    /**
     * Make sure center and scale are within bounds
     */
    public check() {
        if (!this.model.center) { this.model.center = { x: .5, y: .5 }; }
            // Make sure 0 <= x <= 1
        if (this.model.center.x < 0) { this.model.center.x = 0; }
        else if (this.model.center.x > 1) { this.model.center.x = 1; }
            // Make sure 0 <= y <= 1
        if (this.model.center.y < 0) { this.model.center.y = 0; }
        else if (this.model.center.y > 1) { this.model.center.y = 1; }
            // Make sure 100 <= zoom <= 1000
        if (this.model.scale < 1) { this.model.scale = 1; }
        else if (this.model.scale > 10) { this.model.scale = 10; }
    }

    /**
     * Update listeners for map events
     */
    private updateListeners() {
        if (!this.map) {
            return this.timeout('listeners', () => this.updateListeners());
        }
        this.clearListeners();
        if (this.listeners) {
            for (const item of this.listeners) {
                const selector = item.id ? MapUtilities.cleanCssSelector(`#${item.id}`) : `${MapUtilities.cleanCssSelector(item.selector)}`;
                const el = this.map.querySelector(selector);
                if (el) {
                    this.renderer.setStyle(el, 'pointer-events', 'auto');
                    this.subs.obs[`listen_${selector}`] = this.renderer.listen(el, item.event || 'click', () => {
                        if (item.callback) { item.callback(); }
                        else { this.event.emit({ id: selector, type: 'listener_event' }); }
                    })
                } else {
                    this.service.log('Warn', `Unable to find element with selector '${item.id ? `#${item.id}` : `${item.selector}`}'`, item.id ? `#${item.id}` : `${item.selector}`)
                }
            }
            this.model.listeners = this.listeners;
        }
    }

    /**
     * Remove existing listeners from map
     */
    private clearListeners() {
        if (this.model.listeners) {
            for (const item of this.listeners) {
                const selector = item.id ? `#${item.id}` : `${item.selector}`;
                if (this.subs.obs[`listen_${selector}`]) {
                    const el = this.map.querySelector(selector);
                    if (el) {
                        this.renderer.setStyle(el, 'pointer-events', '');
                    }
                    this.subs.obs[`listen_${selector}`] instanceof Function ? this.subs.obs[`listen_${selector}`]() : this.subs.obs[`listen_${selector}`].unsubscribe();
                }
            }
        }
    }

    /**
     * Post changes position of the map
     * @param scale Also post changes to scale
     */
    private changePosition(scale: boolean = false) {
        this.timeout('change', () => {
            this.check();
            this.center = this.model.center;
            this.centerChange.emit(this.center);
            if (scale) {
                this.scale = this.model.scale;
                this.scaleChange.emit(this.scale);
            }
        }, 0);
    }
}
