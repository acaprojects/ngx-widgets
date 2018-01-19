
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2, Type, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MapService } from '../../services/map.service';
import { Animate } from '../../services/animate.service';
import { ChangeDetectorRef } from '@angular/core';
import { MapOverlayContainerComponent } from './map-overlay-container/map-overlay-container.component';
import { OverlayService } from '../../services/overlay.service';

export interface IPointOfInterest {
    id?: string;        // CSS Selector ID of element with map
    name: string;       // Identifier for the point of interest
    coordinates?: {     // Coordinates of the point of interest on the map
        x: number,      // X position with the map
        y: number       // Y position with the map
    };
    cmp: Type<any> | string; // Component to render inside container at the given location
    data: any                // Data to be bound to the model of the given component
}

export interface IFocusItem {
    id?: string;        // CSS Selector ID of element with map
    coordinates?: {     // Coordinates of the point of interest on the map
        x: number,      // X position with the map
        y: number       // Y position with the map
    };
    zoom?: number;      // Zoom value to focus on the item.
    lock?: boolean;     // Fix the position and zoom of the map
}

export interface IMapHandler {
    id: string;       // Selector of the element to handle the event for
    state: string;    // State of the element
    event: string;    // Event to listen for on the given element
    poi?: IPointOfInterest;
}

const POS_OFFSET = .5;

@Component({
    selector: 'map',
    templateUrl: './map.template.html',
    styleUrls: ['./map.styles.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractiveMapComponent {
    @Input() public id: string = '';
    @Input() public src: string = ''; // File location of the map SVG.
    @Input() public styles: any = {}; // Map of CSS Selector IDs to their respective styles
    @Input() public poi: IPointOfInterest[] | any[] = [];
    @Input() public zoom: number = 0; // Zoom Value of the map
    @Input() public reset: any; // Resets center and zoom on value change
    @Input() public focus: IFocusItem; // Element with map to focus on
    @Input() public units: number = 10000; // Width of the map, coordinates are relative to this
    @Input() public center: { x: number, y: number } = { x: .5, y: .5 }; // Origin of the map display
    @Input() public handlers: IMapHandler[] | any[] = [];
    @Output() public zoomChange: any = new EventEmitter();
    @Output() public centerChange: any = new EventEmitter();
    @Output() public event: any = new EventEmitter();

    public interest_points: any[] = [];
    public state: any = {};
    public timers: any = {};
    public tree: any = {};
    public ratio: any = {
        map: {},
        container: {},
    };

    private animations: any = {};

    @ViewChild('container') private container: ElementRef;
    @ViewChild('map') private area: ElementRef;
    @ViewChild('img') private img: ElementRef;
    @ViewChild('overlay') private overlay: MapOverlayContainerComponent;

    constructor(private service: MapService,
                private _cdr: ChangeDetectorRef,
                private renderer: Renderer2,
                private sanitizer: DomSanitizer,
                private animate: Animate,
                private o_service: OverlayService) {

        this.id = `M${Math.floor(Math.random() * 89999999 + 10000000).toString()}`;
        this.animations.render = animate.animation(() => {
            this.zoom = 0;
            this.center = { x: .5, y: .5 };
            this.zoomChange.emit(this.zoom);
            this.centerChange.emit(this.center);
            this.checkBounds();
        }, () => {
            this.update();
        })
    }

    public ngOnChanges(changes: any) {
        if (changes.poi) {
            this.loadPointsOfInterest();
        }
        if (changes.src) {
            this.loadMap();
        }
        if (changes.reset) {
            this.animate.animation(() => {
                this.zoom = 0;
                this.center = { x: .5, y: .5 };
            }, () => {
                this.update();
            }).animate();
        }
        if (changes.handlers) {
            this.clearHandlers();
            this.setupHandlers();
        }
        if (changes.zoom || changes.center) {
            this.animate.animation(() => {
                if (this.focus && this.focus.lock) {
                        this.zoom = changes.zoom ? changes.zoom.previousValue : this.zoom;
                        this.center = changes.center ? changes.changes.previousValue : this.center;
                }
            }, () => {
                this.update();
            }).animate();
        }
        if (changes.styles) {
            this.updateStyles();
        }

        if (changes.focus && this.focus) {
            setTimeout(() => {
                if (this.focus && this.focus.lock && !this.focus.zoom) {
                        this.focus.zoom = this.zoom;
                }
                this.focusEvent();
            }, 20);
        }
    }

    public ngAfterViewInit() {
        this.initOverlay();
    }

    public initOverlay(tries: number = 0) {
        if (tries > 20) { return; }
        if (this.overlay) {
            this.o_service.registerContainer(this.overlay.id, this.overlay);
        } else {
            setTimeout(() => this.initOverlay(++tries), 200);
        }
    }

    public update(post: boolean = false) {
        const x = Math.floor((100 * this.center.x) * 100) / 100;
        const y = Math.floor((100 * this.center.y) * 100) / 100;
        this.state.position = `${x}%, ${y}%`;
        const ratio = this.ratio.container.height / this.ratio.map.height;
        // this.state.scale = `${Math.round((100 + this.zoom) * 10 * (Math.min(1, ratio))) / 1000}`;
        this.state.transform = `translate(${x - 100}%, ${y - 100}%)`;
        if (post) {
            this.zoomChange.emit(this.zoom);
            this.centerChange.emit(this.zoom);
        }
        this._cdr.markForCheck();
    }

    public clearHandlers() {
        if (this.state.old_handlers) {
            for(const handler of this.state.old_handlers) {
                if (handler.unhandle) { handler.unhandle(); }
            }
        }
    }

    public setupHandlers() {
        if (this.handlers) {
            for (const handler of this.handlers) {
                if (handler.id) {
                    const clean_id = handler.id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
                    const el = this.area.nativeElement.querySelector(`#${clean_id}`);
                    if (el) {
                        handler.unhandle = this.renderer.listen(el, handler.event || 'click', () => {
                            this.overlayEvent({
                                type: handler.event || 'click',
                                location: 'Handler',
                                id: handler.id,
                                handler,
                                element: el,
                            });
                        });
                    }
                }
            }
            this.state.old_handlers = this.handlers;
        }
    }

    public checkBounds() {
        // Check position is valid
        if (this.center.x < 0 - POS_OFFSET) { this.center.x = -POS_OFFSET; }
        else if (this.center.x > 1 + POS_OFFSET) { this.center.x = 1 + POS_OFFSET; }
        if (this.center.y < 0 - POS_OFFSET) { this.center.y = -POS_OFFSET; }
        else if (this.center.y > 1 + POS_OFFSET) { this.center.y = 1 + POS_OFFSET; }
        // Check zoom is valid
        if (this.zoom < 0) { this.zoom = 0; }
        else if (this.zoom > 1900) { this.zoom = 1900; }
    }

    public userEvent(e: any) {
        if (e.type === 'Tap') {
            let center = e.event.center;
            if (!center) {
                if (e.event.changedTouches) {
                    const touch = e.event.changedTouches[0];
                    center = { x: touch.clientX, y: touch.clientY };
                } else {
                    center = { x: e.event.clientX, y: e.event.clientY };
                }
            }
            const pos = this.getMapPosition(center);
            e.elements = this.getTapIDs(pos);
            if (!!(window as any).MSInputMethodContext && !!(document as any).documentMode) {
                const elems = this.getElementIDs(e.event.target);
                if (elems && elems.length > 0) {
                    e.elements = e.elements.concat(elems);
                }
            }
            e.map = this.id;
        }
        this.event.emit({ type: 'User', event: e });
        // this._cdr.markForCheck();
    }

    public getElementIDs(el: any): string[] {
        let list: string[] = [];
        if (el) {
            if (el.id) {
                list.push(el.id);
            }
            if (el.parent) {
                const ids = this.getElementIDs(el.parent);
                if (ids && ids.length > 0) {
                    list = list.concat(ids);
                }
            }
        }
        return list;
    }

    public overlayEvent(e: any) {
        this.event.emit({ type: 'Overlay', event: e });
    }

    public initMap(update: boolean = false) {
        for (const el of this.img.nativeElement.children) {
            if (el.nodeName.toLowerCase() === 'svg') {
                this.state.map_el = el;
                break;
            }
        }
        if (this.state.map_el) {
            this.state.map_box = this.state.map_el.getBoundingClientRect();
            this.state.cnt_box = this.container.nativeElement.getBoundingClientRect();
            this.state.map_el.style.position = 'absolute';
            this.state.map_el.style.top = '50%';
            this.state.map_el.style.left = '50%';
            this.state.map_el.style.transform = `translate(-50%, -50%)`;
            // this.state.map_el.style.maxWidth = `100%`;
            // this.state.map_el.style.maxHeight = `100%`;
            this.ratio.map = {
                width: 1,
                height: this.state.map_box.height / this.state.map_box.width,
            };
            this.ratio.container = {
                width: 1,
                height: this.state.cnt_box.height / this.state.cnt_box.width,
            };
            this.state.scale = this.ratio.container.height / this.ratio.map.height;
            setTimeout(() => {
                this.initElementTree();
                this.loadPointsOfInterest();
            }, 100);
            this.focusEvent();
        }
        this.state.map_id = `${this.src}_${Math.floor(Math.random() * 89999999 + 10000000)}`;
        if (update) {
            if (this.timers.update) {
                clearTimeout(this.timers.update);
                this.timers.update = null;
            }
            this.timers.update = setTimeout(() => {
                this.update();
                this.timers.update = null;
            }, 200);
        }
        this._cdr.markForCheck();
    }

    private initElementTree() {
        const map = this.state.map_el.getBoundingClientRect();
        if (map.width === 0) {
            return setTimeout(() => this.initElementTree(), 200);
        }
        let tree = this.service.getMapTree(this.src);
        if (!tree) {
            tree = this.createElementTree(this.state.map_el, map);
            this.service.setMapTree(this.src, tree);
        }
        this.tree = tree;
    }

    private createElementTree(el: Element, container: ClientRect) {
        const tree: any = {};
        if (el) {
            tree.id = el.id;
            tree.children = [];
            tree.position = {};
            if (el.getBoundingClientRect instanceof Function && el.id){
                const scale = 10000;
                const ratio = container.height / container.width;
                const rect = el.getBoundingClientRect();
                const position: any = {
                    top: Math.floor(((rect.top - container.top) / container.height) * (scale * ratio)),
                    left: Math.floor(((rect.left - container.left) / container.width) * scale)
                }
                position.width = Math.floor((rect.width / container.width) * scale);
                position.height = Math.floor((rect.height / container.height) * (scale * ratio));
                position.right = position.left + position.width;
                position.bottom = position.top + position.height;
                tree.position = position;
            }
            if (el.hasChildNodes()) {
                var children = el.childNodes;
                for (const element of (children as any)) {
                    tree.children.push(this.createElementTree(element, container));
                }
            }
        }
        return tree.id || tree.children.length > 0 ? tree : {};
    }

    private getMapPosition(pos: { x: number, y: number }) {
        const position = { x: 0, y: 0 };
        let rect = this.state.map_el.getBoundingClientRect();
        if (rect.width === 0) {
            for (const el of this.img.nativeElement.children) {
                if (el.nodeName.toLowerCase() === 'svg') {
                    this.state.map_el = el;
                    break;
                }
            }
            rect = this.state.map_el.getBoundingClientRect();
        }
        position.x = Math.floor(((pos.x - rect.left) / rect.width) * 10000);
        position.y = Math.floor(((pos.y - rect.top) / rect.height) * (10000 * (rect.height / rect.width)));
        return position;
    }

    private getTapIDs(pos: { x: number, y: number }, el_list?: any[]) {
        let list: any[] = [];
        if (!el_list) {
            el_list = this.tree ? this.tree.children : [];
        }
        for (const el of el_list) {
            if (el && el.position && pos.x >= el.position.left && pos.x <= el.position.right && pos.y >= el.position.top && pos.y <= el.position.bottom) {
                list.push(el.id);
            }
            if (el.children && el.children.length > 0) {
                list = list.concat(this.getTapIDs(pos, el.children));
            }
        }
        return list;
    }

    private loadMap(tries: number = 0) {
        if (tries > 10) { return; }
        this.state.loading = true;
        this.state.map = '';
        this.service.loadMap(this.src)
            .then((map) => {
                this.zoom = 0;
                this.center = { x: .5, y: .5 };
                this.state.map = map;
                this.update();
                this.state.loading = false;
                setTimeout(() => {
                    this.initMap();
                }, 200);
            }, (err) => {
                tries++;
                setTimeout(() => {
                    this.loadMap(tries);
                }, 200 * tries);
            });
    }

    private focusEvent() {
        if (this.focus) {
            if (this.focus.coordinates) {
                const c = this.focus.coordinates;
                this.center = {
                    x: 1 - (c.x / this.units / this.ratio.map.width),
                    y: 1 - (c.y / this.units / this.ratio.map.height),
                };
                this.zoom = this.focus.zoom || 100;
            } else if (this.focus.id) {
                if (this.area && this.state.map_el) {
                    const clean_id = this.focus.id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
                    const el = this.area.nativeElement.querySelector(`#${clean_id}`);
                    if (el) {
                        const box = el.getBoundingClientRect();
                        const map_box = this.area.nativeElement.getBoundingClientRect();
                        const scale = box.width > box.height ? map_box.width / box.width : map_box.height / box.height;
                        const location = {
                            x: 1 - (((box.left - map_box.left) + box.width / 2) / map_box.width),
                            y: 1 - (((box.top - map_box.top) + box.height / 2) / map_box.height),
                        };
                        const zoom = ((scale / 3) * 100) - 100;
                        this.center = location;
                        this.zoom = this.focus.zoom || Math.min(zoom, 700) || 100;
                    }
                } else {
                    setTimeout(() => {
                        this.focusEvent();
                    }, 200);
                }
            }
            this.centerChange.emit(this.center);
            this.zoomChange.emit(this.zoom);
            this.update();
        }
    }

    private loadPointsOfInterest(tries: number = 0) {
        if (tries > 10) { return; }
        if (this.state.map_el) {
            if (this.poi) {
                this.interest_points = [];
                for (const item of this.poi) {
                    if (!item.map_id) {
                        item.map_id = item.id;
                        item.id = `${item.cmp && item.cmp.className ? item.cmp.className() || 'map-cmp-' : 'map-cmp-'}${item.id}`;
                    }
                    this.interest_points.push(item);
                }
            }
            this._cdr.markForCheck();
        } else {
            setTimeout(() => {
                this.loadPointsOfInterest(++tries);
            }, 200);
        }
    }

    private updateStyles() {
        this.state.styles = '';
        for (const id in this.styles) {
            if (this.styles.hasOwnProperty(id)) {
                const clean_id = id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
                const name = `.map[widget].${this.id} ${id && (/^[\#\.\[]{1}.*/g).test(id) ? id : '#' + clean_id}`;
                let properties = '';
                for (const prop in this.styles[id]) {
                    if (this.styles[id].hasOwnProperty(prop)) {
                        properties += `  ${prop}: ${this.styles[id][prop]};`;
                    }
                }
                if (properties) {
                    this.state.styles += `${name} {${properties} } `;
                }
            }
        }
        const el = document.getElementById(`map-styles-${this.id}`);
        if (el) {
            el.innerHTML = this.state.styles;
        } else {
            const head = document.head || document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            style.id = `map-styles-${this.id}`;
            style.type = 'text/css';
            style.innerHTML = this.state.styles;
            head.appendChild(style);
        }
        this._cdr.markForCheck();
    }
}
