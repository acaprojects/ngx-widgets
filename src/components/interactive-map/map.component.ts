import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ACA_Animate } from '../../services';

declare let Hammer: any;

@Component({
    selector: 'interactive-map',
    directives: [ ],
    providers: [ ACA_Animate ], 
    templateUrl: './map.html',
    styles: [
        require('./map.scss')
    ]
})
export class InteractiveMap {
    @Input() map: string;
    @Input() zoomMax: number = 200;
    @Input() zoom: number = 0;
    @Input() controls: boolean = true;
    @Output() tap = new EventEmitter();
    @Output() zoomChange = new EventEmitter();
    //*
        //Toggle Knob
    @ViewChild('displayArea')  self: ElementRef;
    @ViewChild('mapArea')  map_area: ElementRef;
    @ViewChild('mapDisplay')  map_display: ElementRef;
    content_box: any;
    map_box: any;
    map_data: any;
    map_item: any;
    touchmap: any;
    private _zoom: number = 50; // As Percentage
    rotate: number = 0; // In degrees
    left: number = 0;
    top: number = 0;
    useTop: number = 0;
    useLeft: number = 0;
    maxTop: number = 100;
    maxLeft: number = 100;
    zoomed: boolean = false;
    debug: string[] = [];
    map_orientation: string = '';
    activate: boolean = false;
    de: any;
    active = false;



    constructor(private http: Http, private a: ACA_Animate){
    }

    draw: any;

    ngOnInit(){
    	this.setupUpdate();

    	this.draw = this.a.animation(() => {
            	// Clean up any dimension changes
	        if(this.left < -this.maxLeft) this.left = -this.maxLeft;
	        else if(this.left > 0) this.left = 0;
	        if(this.top < -this.maxTop) this.top = -this.maxTop;
	        else if(this.top > 0) this.top = 0;
	        if(this._zoom > this.zoomMax) this._zoom = this.zoomMax;
	        else if (this._zoom < -50) this._zoom = -50;
	        this.zoom = this._zoom;
	        this.zoomChange.emit(this._zoom);
	        this.rotate = this.rotate % 360;
	        return true;
        }, () => {
            	// Update map
            let z = this.map_display.nativeElement.style[this.map_orientation];
	        this.map_display.nativeElement.style[this.map_orientation] = 100 + this._zoom + '%';
	        this.map_display.nativeElement.style.top = this.top + 'px';
	        this.map_display.nativeElement.style.left = this.left + 'px';
	        if(z !== (100 + this._zoom + '%')) this.update(); 
        });
    	this.checkStatus(null, 0);
    }

    ngAfterViewInit() {
        if(Hammer && this.map_area){
                // Setup events via Hammer.js if it is included
            this.de = new Hammer(document, {});
            this.de.on('tap', (event) => { this.checkStatus(event, 0); })
            this.touchmap = new Hammer(this.map_area.nativeElement, {});
                //Tap Map
            this.touchmap.on('tap', (event) => {this.tapMap(event);});
                //Moving Map
            this.touchmap.on('pan', (event) => {this.moveMap(event);});
            this.touchmap.get('pan').set({ directive: Hammer.DIRECTION_ALL, threshold: 5 });
                // Scaling map
            this.touchmap.on('pinch', (event) => {this.scaleMap(event);});
            this.touchmap.get('pinch').set({ enable: true });
        } else if(this.map_area){
                //Setup Normal Events
             
                //*/
        }
    }

   	checkStatus(e, i) {
   		if(i > 3 || !this.map_area) return;
   		let visible = false;
   		let el = this.map_area.nativeElement;
   		while(el) {
   			if(el.nodeName === 'BODY') {
   				visible = true;
   				break;
   			}
   			el = el.parentNode;
   		}
   		if(!visible) {
   			this.active = false;
   			setTimeout(() => { this.checkStatus(e, i+1); }, 100);
   		} else {
   			if(this.active !== visible)  {
   				this.active = true;
   				this.resize();
   			}
   		}
   	}

    ngAfterContentInit() {

    }

    ngOnChanges(changes: any){
        if(changes.map){
            this.loadMapData();
        }
        if(changes.zoom) {
        	this._zoom = this.zoom;
        }
    }

    loadMapData() {
        this.http.get(this.map).map(res => res.text()).subscribe(
            data => this.map_data = data,
            err => console.error(err),
            () => this.setupMap()
        );
    }

    setupMap(){
        if(this.map_data){
            this.map_display.nativeElement.innerHTML = this.map_data;
            this.map_item = this.map_display.nativeElement.children[0];
            this.map_item.style[this.map_orientation] = '100%';
            this.zoomed = true;
            setTimeout(() => { this.resize(); this.update(); }, 200);
        }
    }

    move = {
        x : 0,
        y : 0
    }

    tapMap(event) {
            //Traverse map and return array of clicked elements
        let elems = [];
        let el = this.map_item;
        elems = this.getItems(event.center, el);
        this.tap.emit(elems);
    }

    getItems(pos, el) {
        let elems = []
        for(var i = 0; i < el.children.length; i++){
            let rect = el.children[i].getBoundingClientRect();
            if(pos.y >= rect.top && pos.y <= rect.top + rect.height &&
               pos.x >= rect.left && pos.x <= rect.left + rect.width) {
                if(el.children[i].id) elems.push(el.children[i].id);
                let celems = this.getItems(pos, el.children[i]);
                elems = elems.concat(celems);
            }
        }
        return elems;
    }


    moveMap(event) {
    	if(this.move.x === 0 && this.move.y === 0) {
            this.move.x = event.deltaX;
            this.move.y = event.deltaY;
    	}
        this.top += event.deltaY - this.move.y;
        this.left += event.deltaX - this.move.x; 
        	// Update the display of the map
        this.redraw();
        if(event.type === 'pan' && (event.additionalEvent && event.additionalEvent.indexOf('pan') >= 0)){
            this.move.x = event.deltaX;
            this.move.y = event.deltaY;
        } else if(event.type === 'pan') {
            this.move.x = this.move.y = 0;
            this.activate = false;
        }
    }

    scaleMap(event) {
        this.debug.push(JSON.stringify(event));
        this._zoom += event.scale;
        this.redraw();
	    this.update();
    }

    zoomIn() {
        this._zoom += 10;
        this.redraw();
	    this.update();
    }

    zoomOut() {
        this._zoom -= 10;
        this.redraw();
    }

    resetZoom() {
        this._zoom = 0;
        this.redraw();
	    this.update();
    }

    private redraw(){
    	this.draw.animate();
    }

    resize() {
        this.content_box = this.self.nativeElement.getBoundingClientRect();
        if(this.map_item) {
            let rect = this.map_item.getBoundingClientRect();
            let md = this.map_display.nativeElement;
            if(this.map_orientation.length > 0 && md.style[this.map_orientation])
                md.style[this.map_orientation] = '';
            this.map_orientation = rect.width > rect.height ? 'width' : 'height';
        }
        this.update();
    }

    updateAnimation: any;

    setupUpdate() {
    	this.updateAnimation = this.a.animation(() => {}, () => {
	        this.map_box = this.map_display.nativeElement.getBoundingClientRect();
	        this.maxTop  = this.map_box.height - this.content_box.height;
	        this.maxLeft = this.map_box.width - this.content_box.width;
	        if(this.maxTop < 0) this.maxTop = 0;
	        if(this.maxLeft < 0) this.maxLeft = 0;
	        this.redraw();
	    });
    }

    update() {
    	this.updateAnimation.animate();
    }

}
