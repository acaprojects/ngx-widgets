/**
* @Author: Alex Sorafumo <alex.sorafumo>
* @Date:   09/01/2017 12:01 PM
* @Email:  alex@yuion.net
* @Filename: pin.component.ts
* @Last modified by:   alex.sorafumo
* @Last modified time: 17/01/2017 9:40 AM
*/

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, animate, style, state, group, keyframes } from '@angular/core';

const DEFAULT_COLORS = {
    main: '#F44336',
    active: '#4CAF50',
    stroke: '#FFFFFF'
}

const MARKER_TYPES = ['Pin', 'Marker', 'Radius']

@Component({
    selector: 'map-marker',
    templateUrl: './marker.template.html',
    styleUrls: ['./marker.styles.css'],
    animations: [
        trigger('pin', [
            state('hide', style({opacity: 0})),
            state('show', style({opacity: 1})),
            transition('* => show',
                animate('700ms ease-out',
                    keyframes([
                        style({transform: 'translateY(-400%)', opacity: 0, offset: 0}),
                        style({transform: 'translateY(0%)', opacity: 1, offset:1})
                    ])
                )
            )
        ])
    ]
})
export class MapMarkerComponent {
    @Input() type: string = 'Pin';
    @Input() text: string = '';
    @Input() show: boolean = false;
    @Input() color: string = '#F44336';
    @Input() highlight: string = '#4CAF50';
    @Input() stroke: string = '#FFFFFF';
    @Input() active: boolean = false;
    @Input() width: number = 2;
    @Input() height: number = 2;
    @Input() x: number = 0;
    @Input() y: number = 0;
    @Input() fontSize: string = '1em';
    @Input() radiusSize: number = 20;
    @Output() activeChange = new EventEmitter();

    id: string = ''
    display_pin: string = ''
    static pin_html: string = `
    <?xml version="1.0" encoding="utf-8"?><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 53 65.7" style="enable-background:new 0 0 53 65.7;" xml:space="preserve"><style type="text/css">.aca-st0{fill:#FFFFFF;} .aca-st1{fill:#DC6900;stroke:#FFFFFF;stroke-width:2.5;stroke-miterlimit:10;}</style><g><circle class="aca-st0" cx="27.6" cy="21.8" r="13.1"/><path class="aca-st1" d="M27.6,4c9.9,0,18,8.1,18,18s-17.1,38.2-18,39.6c-0.9-1.5-18-29.7-18-39.6S17.7,4,27.6,4z M27.6,32.8 c6,0,10.8-4.8,10.8-10.8s-4.8-10.8-10.8-10.8S16.8,16,16.8,22S21.6,32.8,27.6,32.8"/></g></svg>
    `
    constructor() {
        this.id = Math.floor(Math.random() * 89999999 + 10000000).toString();
    }

    ngOnInit() {
        this.show = false;
        setTimeout(() => { this.show = true }, 300);
    }

    ngOnChanges(changes: any) {
        if((changes.color || changes.highlight || changes.stroke)) {
            if(!this.color) this.color = DEFAULT_COLORS.main;
            if(!this.highlight) this.highlight = DEFAULT_COLORS.active;
            if(!this.stroke) this.stroke = DEFAULT_COLORS.stroke;
            this.init();
        }
        if(changes.type) {
            if(!this.type) this.type = 'Pin';
            else if(MARKER_TYPES.indexOf(this.type) < 0) this.type = 'Pin';
        }
    }
    /**
     * Initialises the marker
     * @return {void}
     */
    init() {
        this.display_pin = this.getPin();
    }
    /**
     * Generates HTML for the display of the pin
     * @return {void}
     */
    getPin() {
        let pin = MapMarkerComponent.pin_html;
        if(this.active) {
            pin = this.replaceAll(pin, '#DC6900', this.highlight);
        } else {
            pin = this.replaceAll(pin, '#DC6900', this.color);
        }
        pin = this.replaceAll(pin, '#FFFFFF', this.stroke);
        pin = this.replaceAll(pin, 'aca-', ('aca-marker-' + this.id + '-'));
        return pin;
    }
    /**
     * Replace all occurance of a string within another string
     * @param  {string} str     String to modify
     * @param  {string} find    String to find
     * @param  {string} replace String to replace with
     * @return {string} Modified string
     */
    private replaceAll(str: string, find: string, replace: string) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

}
