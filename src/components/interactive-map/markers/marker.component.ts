/**
 * @Author: Alex Sorafumo <alex.sorafumo>
 * @Date:   09/01/2017 12:01 PM
 * @Email:  alex@yuion.net
 * @Filename: pin.component.ts
 * @Last modified by:   alex.sorafumo
 * @Last modified time: 17/01/2017 9:40 AM
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, group, keyframes, state, style, transition, trigger } from '@angular/core';

const DEFAULT_COLORS = {
    main: '#F44336',
    active: '#4CAF50',
    stroke: '#FFFFFF',
};

const MARKER_TYPES = ['Pin', 'Marker', 'Radius'];

@Component({
    selector: 'map-marker',
    templateUrl: './marker.template.html',
    styleUrls: ['./marker.styles.css'],
    animations: [
        trigger('drop', [
            state('hide', style({transform: 'translate(-50%, -400%)'})),
            state('show', style({transform: 'translate(-50%, 0%)'})),
            transition('* <=> *', animate('700ms ease-out')),
        ]),
        trigger('show', [
            state('hide', style({opacity: 0})),
            state('show', style({opacity: 1})),
            transition('* <=> *', animate('700ms ease-out')),
        ]),
    ],
})
export class MapMarkerComponent {

    private static pin_html: string = `
    <?xml version="1.0" encoding="utf-8"?>
    <svg version="1.1" xmlns="http:// www.w3.org/2000/svg" xmlns:xlink="http:// www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 53 65.7" style="enable-background:new 0 0 53 65.7;" xml:space="preserve">

        <style type="text/css">
        .aca-st0{fill:#FFFFFF;}
        .aca-st1{fill:#DC6900;stroke:#FFFFFF;stroke-width:2.5;stroke-miterlimit:10;}
        </style>
        <g>
            <circle class="aca-st0" cx="27.6" cy="21.8" r="13.1"/>
            <path class="aca-st1" d="M27.6,4c9.9,0,18,8.1,18,18s-17.1,38.2-18,39.6c-0.9-1.5-18-29.7-18-39.6S17.7,4,27.6,4z M27.6,32.8 c6,0,10.8-4.8,10.8-10.8s-4.8-10.8-10.8-10.8S16.8,16,16.8,22S21.6,32.8,27.6,32.8"/>
        </g>
    </svg>
    `;

    @Input() public type: string = 'Pin';
    @Input() public text: string = '';
    @Input() public show: boolean = false;
    @Input() public color: string = '#F44336';
    @Input() public highlight: string = '#4CAF50';
    @Input() public stroke: string = '#FFFFFF';
    @Input() public active: boolean = false;
    @Input() public width: number = 2;
    @Input() public height: number = 2;
    @Input() public x: number = -9999;
    @Input() public y: number = -9999;
    @Input() public fontSize: string = '1em';
    @Input() public radiusSize: number = 20;
    @Input() public drop: boolean = false;
    @Output() public activeChange = new EventEmitter();

    public display_pin: string = '';
    public shown: boolean = false;

    private id: string = '';
    private reset_timer: any = null;
    private show_timer: any = null;

    constructor() {
        this.id = Math.floor(Math.random() * 89999999 + 10000000).toString();
    }

    public ngOnChanges(changes: any) {
        if ((changes.color || changes.highlight || changes.stroke)) {
            if (!this.color) {
                this.color = DEFAULT_COLORS.main;
            }
            if (!this.highlight) {
                this.highlight = DEFAULT_COLORS.active;
            }
            if (!this.stroke) {
                this.stroke = DEFAULT_COLORS.stroke;
            }
            this.init();
        }
        if (changes.type) {
            if (!this.type) {
                this.type = 'Pin';
            } else if (MARKER_TYPES.indexOf(this.type) < 0) {
                this.type = 'Pin';
            }
        }
        if (changes.x || changes.y) {
            if (!this.x) {
                this.x = -9999;
            }
            if (!this.y) {
                this.y = -9999;
            }
        }
        if (changes.show && this.show && this.shown !== this.show) {
            if (this.show_timer) {
                clearTimeout(this.show_timer);
            }
            this.show_timer = setTimeout(() => {
                this.shown = this.show;
                this.show_timer = null;
            }, 200);
            // this.reset();
        }
    }
    /**
     * Generates HTML for the display of the pin
     * @return {void}
     */
    public getPin() {
        let pin = MapMarkerComponent.pin_html;
        if (this.active) {
            pin = this.replaceAll(pin, '#DC6900', this.highlight);
        } else {
            pin = this.replaceAll(pin, '#DC6900', this.color);
        }
        pin = this.replaceAll(pin, '#FFFFFF', this.stroke);
        pin = this.replaceAll(pin, 'aca-', ('aca-marker-' + this.id + '-'));
        return pin;
    }
    /**
     * Initialises the marker
     * @return {void}
     */
    private init() {
        this.display_pin = this.getPin();
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
