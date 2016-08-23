import { Component, Pipe, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, animate, style, state, group, keyframes } from '@angular/core';

import { ACA_Animate } from '../../services/animate.service';
import { MapService } from './map.service';

declare let Hammer: any;

const ZOOM_LIMIT = 1000;

const zoom_anim = (function() {
	let base = 50;
	let space = 1;
	let max = ZOOM_LIMIT;
	let time = '200ms ease-in-out';
	let animation = [];
    	// Create States
	for(let i = base; i < max; i += space) {
			//Width
		let pos = i + '%';
		animation.push(state(i.toString() + 'w',   style({'width': pos})));
			// Add transition
		let t = '* => ' + i.toString() + 'w';
		let start = style({'width':'*', offset: 0 });
		let end = style({'width':pos, offset: 1 });
		animation.push(transition(t, animate(time, end) ));
			//Height
		pos = i + '%';
		animation.push(state(i.toString() + 'h',   style({'height': pos})));
			// Add transition
		t = '* => ' + i.toString() + 'h';
		start = style({'height':'*', offset: 0 });
		end = style({'height':pos, offset: 1 });
		animation.push(transition(t, animate(time, end)));
	}
	animation.push(transition('void => *', []));
	return animation;
})();


@Component({
    selector: 'interactive-map',
    templateUrl: './map.html',
    styles: [
        require('./map.scss')
    ],
    animations: [
        trigger('zoom', zoom_anim),
        trigger('pin', [
        	state('hide', style({opacity: 0})),
        	state('show', style({opacity: 1})),
        	transition('* => show', [ style({top: '-100px', opacity: 0}), animate('700ms ease-out', style({top: '*', opacity: 1})) ])
        ])
    ]
})
export class InteractiveMap {
    @Input() map: string;
    @Input() zoomMax: number = 200;
    @Input() zoom: number = 0;
    @Input() controls: boolean = true;
    @Input() disable: string[] = [];
    @Input() pins: any[] = []; 
    @Input() mapSize: any = { x: 100, y: 100 };
    @Input() focus: string;
    @Input() focusScroll: boolean = false;
    @Input() focusZoom: number = 80;
    @Input() color: string = '#000';
    @Input() mapStyles: { id: string, color: string, fill: string, opacity: string }[] = [];
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
    private _zoom: number = 0; // As Percentage
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
   	min = 20;
   	isFocus = false;
   	loading = true;
   	private _top: number = 0;
   	private _left: number = 0;
   	zoom_state: string = '100w';
   	top_state: string = '0px';
   	left_state: string = '0px';

   	pin_html = `
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 20.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="flat_x5F_Pin" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
	 y="0px" viewBox="0 0 53 65.7" style="enable-background:new 0 0 53 65.7;" xml:space="preserve">
<style type="text/css">
	.aca-st0{fill:#FFFFFF;}
	.aca-st1{fill:#DC6900;stroke:#FFFFFF;stroke-width:2.5;stroke-miterlimit:10;}
</style>
<g>
	<circle class="aca-st0" cx="27.6" cy="21.8" r="13.1"/>
	<path class="aca-st1" d="M27.6,4c9.9,0,18,8.1,18,18s-17.1,38.2-18,39.6c-0.9-1.5-18-29.7-18-39.6S17.7,4,27.6,4z M27.6,32.8
		c6,0,10.8-4.8,10.8-10.8s-4.8-10.8-10.8-10.8S16.8,16,16.8,22S21.6,32.8,27.6,32.8"/>
</g>
</svg>
   	`

   	pin_defaults = {
   		x: 0,
   		y: 0,
   		colors : {
   			one: '#DC6900',
   			two : '#FFFFFF'
   		}
   	}

   	pin_cnt: number = 0;


    constructor(private a: ACA_Animate, private service: MapService){
    }

    draw: any = null;
    drawing: any = null;

    ngOnInit(){
    	this.setupUpdate();

    	this.draw = this.a.animation(() => {
    		return this.update();
        }, () => {
        	this.render();
        });
    	this.checkStatus(null, 0);
    	setInterval(() => {
    		if(this.active && this.pins && this.pin_cnt !== this.pins.length) this.setupPins();
    	}, 200);
    	setInterval(() => {
    		this.checkStatus(null, 0);
    	}, 1000);
    }

    update() {
    	this.left = this._left;
    	this.top = this._top;
        	// Clean up any dimension changes
        if(!this.isFocus) {
	        if(this.left < -this.maxLeft) this.left = -this.maxLeft;
	        else if(this.left > 0) this.left = 0;
	        if(this.top < -this.maxTop) this.top = -this.maxTop;
	        else if(this.top > 0) this.top = 0;
	        if(this._zoom > this.zoomMax || this._zoom > ZOOM_LIMIT) this._zoom = this.zoomMax;
	        else if (this._zoom < -50) this._zoom = -50;
	    }
        this.zoom = this._zoom;
        this.zoomChange.emit(this._zoom);
        this.rotate = this.rotate % 360;
        return true;
    }

    render() {
        	// Update map
        if(this.map_display && this.active) {
            let z = this.map_display.nativeElement.style[this.map_orientation];
            let d = this.map_orientation ? this.map_orientation[0].toLowerCase() : 'w';
	        this.zoom_state = Math.round(100 + this._zoom) + d;

	        this.map_display.nativeElement.style.top = Math.round(this.top) + 'px';
	        this.map_display.nativeElement.style.left = Math.round(this.left) + 'px';
	        if(z !== (Math.round(100 + this._zoom) + '%')) this.updateBoxes(); 
	        else if(this.isFocus) this.finishFocus();
	        this.setupPins();
	    }
    }

    clearDisabled(strs:string[]) {
        for(let i = 0; i < strs.length; i++) {
        	let el = this.map_display.nativeElement.querySelector('#' + this.escape(strs[i]));
        	if(el !== null) {
        		el.style.display = 'inherit';
        	}
        }
    }

    setupDisabled() {
    	if(this.active) {
	        for(let i = 0; i < this.disable.length; i++) {
	        	let el = this.map_display.nativeElement.querySelector('#' + this.escape(this.disable[i]));
	        	if(el !== null) {
	        		el.style.display = 'none';
	        	}
	        }
	    }
    }

    setupStyles() {
    	if(!this.mapStyles || !this.map_area) return;
    	for(let i = 0; i < this.mapStyles.length; i++){
    		let style = this.mapStyles[i];
        	let el = this.map_area.nativeElement.querySelector('#' + this.escape(style.id));
        	if(el) {
        		if(style.color) el.style.color = style.color;
        		if(style.opacity) el.style.opacity = style.opacity;
        		if(style.fill) el.style.fill = style.fill;
        	}
    	}
    }

    clearPins() {
    	this.pins = [];
    }

    isVisible() {
    	if(this.self) {
    			//Check if the map area is visiable
    		let bb = this.self.nativeElement.getBoundingClientRect();
    		if(bb.left + bb.width < 0) return false;
    		else if(bb.top + bb.height < 0) return false;
    		else if(bb.top > window.innerHeight) return false;
    		else if(bb.left > window.innerWidth) return false;
    		return true;
    	}
    	return false;
    }

    setupPins() {
    	if(this.active) {
	    	this.pin_cnt = this.pins.length;
	        for(let i = 0; i < this.pins.length; i++) {
	        	let pin = this.pins[i];
	        	if(typeof pin !== 'object') {
	        		pin = this.pin_defaults;
	        	} else {
	        		if(!pin.x) pin.x = this.pin_defaults.x;
	        		if(!pin.y) pin.x = this.pin_defaults.y;
	        		if(!pin.colors) pin.x = this.pin_defaults.colors;
	        		else { 
	        			if(!pin.colors.one   || pin.colors.one.length > 25) pin.colors.one = this.pin_defaults.colors.one;
	        			if(!pin.colors.two   || pin.colors.one.length > 25) pin.colors.two = this.pin_defaults.colors.two;
	        		}
	        	}
	        	let el = this.map_area.nativeElement.querySelector('#aca-map-pin' + i);
	        	if(el !== null) {
	        		if(pin.id) {
	        			let elc = this.map_display.nativeElement.querySelector('#' + this.escape(pin.id));
	        			if(elc !== null) {
	        				let bb = elc.getBoundingClientRect();
			        		let ebb = el.getBoundingClientRect();
	    					let cbb = this.map_area.nativeElement.getBoundingClientRect();
	        				el.style.top = (bb.top - (ebb.height) + bb.height/2 - cbb.top) + 'px';
	        				el.style.left = (bb.left) + 'px';
	        			}
	        		} else {
		        		let percentY = Math.min(this.mapSize.y, pin.y) / this.mapSize.y;
		        		let percentX = Math.min(this.mapSize.x, pin.x) / this.mapSize.x;
		        		let w = 0; let h = 0; let aw = 0; let ah = 0;
		        		if(this.content_box) {
			        		w = parseInt(this.map_display.nativeElement.style[this.map_orientation])/100 * this.content_box.width;
			        		h = parseInt(this.map_display.nativeElement.style[this.map_orientation])/100 * this.content_box.height;
			        		aw = this.content_box.width;
			        		ah = this.content_box.height;
			        	}
			        	let bb = el.getBoundingClientRect();

		        		el.style.top = ((Math.round(percentY * h) + this.top) - bb.height) + 'px';
		        		el.style.left = (Math.round(percentX * w) + this.left ) + 'px';
		        	}
		        	let html = this.getPin(pin, i);
		        	let text = el.children[el.children.length-1];
		        	el.innerHTML = html;
		        	if(text) el.appendChild(text);
	        	}
	        	this.pins[i].status = 'show';
	        }
	    }
    }

    escape (value) {
		var string = String(value);
		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = '';
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);
			// Note: there’s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
			// (U+FFFD).
			if (codeUnit == 0x0000) {
				result += '\uFFFD';
				continue;
			}

			if (
				// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
				// U+007F, […]
				(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
				// If the character is the first character and is in the range [0-9]
				// (U+0030 to U+0039), […]
				(index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				// If the character is the second character and is in the range [0-9]
				// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
				(
					index == 1 &&
					codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
					firstCodeUnit == 0x002D
				)
			) {
				// https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}

			if (
				// If the character is the first character and is a `-` (U+002D), and
				// there is no second character, […]
				index == 0 &&
				length == 1 &&
				codeUnit == 0x002D
			) {
				result += '\\' + string.charAt(index);
				continue;
			}

			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), […]
			if (
				codeUnit >= 0x0080 ||
				codeUnit == 0x002D ||
				codeUnit == 0x005F ||
				codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
				codeUnit >= 0x0041 && codeUnit <= 0x005A ||
				codeUnit >= 0x0061 && codeUnit <= 0x007A
			) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// https://drafts.csswg.org/cssom/#escape-a-character
			result += '\\' + string.charAt(index);

		}
		return result;
	}

    getPin(data: any, i: number) {
    	let pin = this.pin_html;
    	pin = this.replaceAll(pin, '#DC6900', data.colors.one);
    	pin = this.replaceAll(pin, '#FFFFFF', data.colors.two);
    	pin = this.replaceAll(pin, 'aca-', ('aca-' + i + '-'));
    	return pin;
    }

    private replaceAll(str, find, replace) {
  		return str.replace(new RegExp(find, 'g'), replace);
	}

    ngAfterViewInit() {
        if(Hammer && this.map_area && (!this.focus || this.focus === '' || this.focusScroll)){
                // Setup events via Hammer.js if it is included
            this.de = new Hammer(document, {});
            this.de.on('tap', (event) => { this.checkStatus(event, 0); })
            this.touchmap = new Hammer(this.map_area.nativeElement, {});
                //Tap Map
            this.touchmap.on('tap', (event) => {this.tapMap(event);});
                //Moving Map
            this.touchmap.on('pan', (event) => {this.moveMap(event);});
            this.touchmap.on('panend', (event) => {this.moveEnd(event);});
            this.touchmap.get('pan').set({ directive: Hammer.DIRECTION_ALL, threshold: 5 });
                // Scaling map
            this.touchmap.on('pinch', (event) => {this.scaleMap(event);});
            this.touchmap.on('pinchend', (event) => {this.scaleEnd(event);});
            this.touchmap.get('pinch').set({ enable: true });
        } else if(this.map_area){
                //Setup Normal Events
             
                //*/
        }
        this.setupPins();
        if(this.focus) this.updateFocus();
    }

   	checkStatus(e, i) {
   		if(i > 2) return;
   		//console.log('Check Status ' + i);
   		let visible = false;
   		let el = this.self.nativeElement;
   		while(el) {
   			if(el.nodeName === 'BODY') {
   				visible = true;
   				break;
   			}
   			el = el.parentNode;
   		}
   		if(visible) visible = this.isVisible();
   		if(!visible) {
   			this.active = false;
   			this.loading = true;
   			//setTimeout(() => { this.checkStatus(e, i+1); }, 50);
   		} else {
   			if(this.active !== visible)  {
   				this.active = true;
   				setTimeout(() => {
   					this.loadMapData();
   				}, 100);
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
        	if(this.draw !== null) this.updateBoxes();
        }
        if(changes.disable) {
        	let pv = changes.disable.previousValue;
        	if(pv !== null && pv !== undefined) this.clearDisabled(pv);
        	this.setupDisabled();
        }
        if(changes.pins && this.pins) {
        	this.pin_cnt = this.pins.length;
        	this.setupPins();
        }
        if(changes.mapStyles) {
        	this.setupStyles();
        }
        if(changes.focus) {
        	this.updateFocus();
        }
    }

    updateFocus() {
    	if(!this.map_display) return;
    	if(this.focus === null || this.focus === undefined || this.focus === '') return;
    	this.zoomMax = 100000;
    	let el = this.map_display.nativeElement.querySelector('#' + this.escape(this.focus));
    	if(el !== null) {
    		let cbb = this.map_display.nativeElement.getBoundingClientRect();
    		let mbb = this.map_area.nativeElement.getBoundingClientRect();
    		if(cbb && mbb) {
	    		let bb = el.getBoundingClientRect();
	    		let wZoom = mbb.width  / bb.width  * (cbb[this.map_orientation] / mbb[this.map_orientation] ) / 3;
	    		let hZoom = mbb.height / bb.height * (cbb[this.map_orientation] / mbb[this.map_orientation] ) / 3;
	    		this._top = 0;
	    		this._left = 0;
	    		this._zoom = (wZoom > hZoom ? hZoom : wZoom) * this.focusZoom;
	    		this.isFocus = true;
	    		this.redraw()
	    		this.updateBoxes();
    		} else {
    			setTimeout(() => {
    				this.updateFocus();
    			}, 100)
    		}
    	} else {
			setTimeout(() => {
				this.updateFocus();
			}, 100)
		}
    }

    finishFocus() {
    	this.isFocus = false;
    	let el = this.map_display.nativeElement.querySelector('#' + this.escape(this.focus));
    	if(el !== null) {
    		let cbb = this.map_display.nativeElement.getBoundingClientRect();
    		let mbb = this.map_area.nativeElement.getBoundingClientRect();
    		let bb = el.getBoundingClientRect();
    		this._top = -(bb.top - cbb.top) + (mbb.height - bb.height)/2;
    		this._left = -(bb.left - cbb.left) + (mbb.width - bb.width)/2;
    		this.redraw();
    	}
    }

    loadMapData() {
        this.loading = true;
    	this.map_data = null;
    	if(this.active) {
	        this.map_display.nativeElement.innerHTML = '';
	    	if(this.map && this.map.indexOf('.svg') >= 0 && this.map.length > 4) {
		    	this.service.getMap(this.map).then((data) => {
		    		this.map_data = data;
		    		this.setupMap();
		    	}, (err) => {
		    		console.error('ACA_WIDGETS: Error loading map "' + this.map + '".');
		    		console.error(err);
		    	});
		    } else {
		    	if(!this.map) console.error('ACA_WIDGETS: Path to map is not valid.');
		    	else if(this.map.indexOf('.svg') < 0) console.error('ACA_WIDGETS: Path to map is not an SVG.');
		    	else if(this.map.length > 4) console.error('ACA_WIDGETS: Path to map is not long enough. It needs to be longer than 4 characters'); 
		    	else console.error('ACA_WIDGETS: Unknown error loading map with map path "' + this.map + '".');
		    	this.loading = false;
		    }
		} else {
			setTimeout(() => {
				this.loadMapData();
			}, 200);
		}
    }

    setupMap(){
        if(this.map_data){
            this.map_display.nativeElement.innerHTML = this.map_data;
            this.map_item = this.map_display.nativeElement.children[0];
            this.map_item.style[this.map_orientation] = '100%';
            this.zoomed = true;
            setTimeout(() => { this.resize(); this.updateBoxes(); }, 200);
        	this.setupDisabled();
        	this.setupPins();
        	this.setupStyles();
        }
        this.loading = false;
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
    	let dX = +event.deltaX - +this.move.x;
    	let dY = +event.deltaY - +this.move.y
        this._top += Math.min(this.min, +Math.abs(dY)) * (dY < 0 ? -1 : 1);
        this._left += Math.min(this.min, +Math.abs(dX)) * (dX < 0 ? -1 : 1);
        if(this._left < -this.maxLeft) this._left = -this.maxLeft;
        else if(this._left > 0) this._left = 0;
        if(this._top < -this.maxTop) this._top = -this.maxTop;
        else if(this._top > 0) this._top = 0;
        	// Update the display of the map
        this.redraw();
        this.move.x = event.deltaX;
        this.move.y = event.deltaY;
        if(this.min < 100) this.min += 10;
    }

    moveEnd(event) {
        this.move.x = this.move.y = 0;
        this.activate = false;
        this.min = 1;
    }


    dZoom = 1;

    scaleMap(event) {
        this._zoom = (100 + this._zoom) * (1 + (event.scale - this.dZoom) / 10 ) - 100;
        this.redraw();
	    this.updateBoxes();
        this.dZoom = event.scale;
    }

    scaleEnd(event) {
    	this.dZoom = 1
    }

    zoomIn() {
        this._zoom += 10;
        this.redraw();
	    this.updateBoxes();
    }

    zoomOut() {
        this._zoom -= 10;
        this.redraw();
	    this.updateBoxes();
    }

    resetZoom() {
        this._zoom = 0;
        this.redraw();
	    this.updateBoxes();
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
        this.updateBoxes();
	    this.updateFocus();
     	this.loading = false;
    }

    updateAnimation: any;

    setupUpdate() {
    	this.updateAnimation = this.a.animation(() => {}, () => {
	        this.map_box = this.map_display.nativeElement.getBoundingClientRect();
	        this.maxTop  = this.map_box.height - this.content_box.height;
	        this.maxLeft = this.map_box.width - this.content_box.width;
	        if(this.maxTop < 0) this.maxTop = 0;
	        if(this.maxLeft < 0) this.maxLeft = 0;
	        this.zoomChange.emit(this.zoom);
	        this.redraw();
	    });
    }

    updateBoxes() {
    	this.updateAnimation.animate();
    }

}

