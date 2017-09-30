
import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MapService } from '../../services/map.service';

@Component({
    selector: 'map',
    templateUrl: './map.template.html',
    styleUrls: ['./map.styles.css'],
})
export class InteractiveMapComponent {
    @Input() public id: string = '';
    @Input() public src: string = '';
    @Input() public styles: any = {};
    @Input() public poi: any[] = [];
    @Input() public zoom: number = 0;
    @Input() public reset: any;
    @Input() public focus: any;
    @Input() public units: number = 10000;
    @Input() public center: { x: number, y: number } = { x: .5, y: .5 };
    @Output() public zoomChange: any = new EventEmitter();
    @Output() public centerChange: any = new EventEmitter();
    @Output() public event: any = new EventEmitter();

    public interest_points: any[] = [];
    public state: any = {};
    public timers: any = {};
    public map_ratio: any = {};

    @ViewChild('map') private area: ElementRef;
    @ViewChild('img') private img: ElementRef;

    constructor(private service: MapService, private renderer: Renderer2, private sanitizer: DomSanitizer) {
        this.id = `M${Math.floor(Math.random() * 89999999 + 10000000).toString()}`;
    }

    public ngOnInit() {

    }

    public ngOnChanges(changes: any) {
        if (changes.poi) {
            this.loadPointsOfInterest();
        }
        if (changes.src) {
            this.loadMap();
        }
        if (changes.reset) {
            setTimeout(() => {
                this.zoom = 0;
                this.center = { x: .5, y: .5 };
                this.zoomChange.emit(this.zoom);
                this.centerChange.emit(this.center);
                this.update();
            }, 10);
        }
        if (changes.zoom || changes.center) {
            setTimeout(() => {
                if (this.focus && this.focus.lock) {
                    this.zoom = changes.zoom ? changes.zoom.previousValue : this.zoom;
                    this.center = changes.center ? changes.changes.previousValue : this.center;
                }
                this.update();
            }, 10);
        }
        if (changes.styles) {
            this.updateStyles();
        }

        if (changes.focus) {
            this.focusEvent();
        }
    }

    public update() {
        this.checkBounds();
        const x = Math.floor((100 * this.center.x) * 100) / 100;
        const y = Math.floor((100 * this.center.y) * 100) / 100;
        this.state.position = `${x}%, ${y}%`;
        this.state.scale = `${Math.round((100 + this.zoom) * 10) / 1000}`;
        this.state.transform = `translate(${x - 100}%, ${y - 100}%)`;
    }

    public checkBounds() {
            // Check position is valid
        if (this.center.x < 0) { this.center.x = 0; }
        else if (this.center.x > 1) { this.center.x = 1; }
        if (this.center.y < 0) { this.center.y = 0; }
        else if (this.center.y > 1) { this.center.y = 1; }
            // Check zoom is valid
        if (this.zoom < -50) { this.zoom = -50; }
        else if (this.zoom > 1900) { this.zoom = 1900; }
    }

    public userEvent(e: any) {
        this.event.emit({ type: 'User', event: e });
    }

    public overlayEvent(e: any) {
        this.event.emit({ type: 'Overlay', event: e });
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
                    x: 1 - (c.x / this.units / this.map_ratio.width),
                    y: 1 - (c.y / this.units / this.map_ratio.height),
                };
                this.zoom = this.focus.zoom || 100;
            } else if (this.focus.id) {
                if (this.area && this.state.map_el) {
                    const clean_id = this.focus.id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
                    const el = this.area.nativeElement.querySelector(`#${clean_id}`);
                    if (el) {
                        const box = el.getBoundingClientRect();
                        const map_box = this.area.nativeElement.getBoundingClientRect();
                        console.log(box, map_box);
                        const location = {
                            x: 1 - (((box.left - map_box.left) + box.width / 2) / map_box.width),
                            y: 1 - (((box.top - map_box.top) + box.height / 2) / map_box.height),
                        };
                        const zoom = (((map_box.width / box.width) / 4) * 100) - 100;
                        this.center = location;
                        this.zoom = this.focus.zoom || Math.min(zoom, 700) || 100;
                        console.log('Details', this.center, this.zoom + 100);
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

    private loadPointsOfInterest() {
        if (this.state.map_el) {
            if (this.poi) {
                this.interest_points = [];
                for (const item of this.poi) {
                    this.interest_points.push(item);
                }
            }
        } else {
            setTimeout(() => {
                this.loadPointsOfInterest();
            }, 200);
        }
    }

    private updateStyles() {
        this.state.styles = '';
        for (const id in this.styles) {
            if (this.styles.hasOwnProperty(id)) {
                const clean_id = id.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
                const name = `.map[widget].${this.id} #${clean_id}`;
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
    }

    private initMap() {
        for (const el of this.img.nativeElement.children) {
            if (el.nodeName.toLowerCase() === 'svg') {
                this.state.map_el = el;
                break;
            }
        }
        if (this.state.map_el) {
            this.state.map_box = this.state.map_el.getBoundingClientRect();
            this.state.area_box = this.img.nativeElement.getBoundingClientRect();
            let scale = 1;
            if (this.state.map_box.height > this.state.area_box.height) {
                scale = 1 / (this.state.map_box.height / this.state.area_box.height);
                this.state.map_el.style.width = `${Math.floor(10000 * scale) / 100}%`;
            }
            this.state.map_el.style.position = 'absolute';
            this.state.map_el.style.top = '50%';
            this.state.map_el.style.left = '50%';
            this.state.map_el.style.transform = `translate(-50%, -50%)`;
            this.map_ratio = {
                width: 1,
                height: this.state.map_box.height / this.state.map_box.width,
            };
            this.focusEvent();
        }
    }
}
