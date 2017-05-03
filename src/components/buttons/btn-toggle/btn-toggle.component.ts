/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   15/09/2016 12:32 PM
 * @Email:  alex@yuion.net
 * @Filename: btn.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 07/02/2017 11:51 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'btn-toggle',
    styleUrls: [ './btn-toggle.styles.css', '../../material-styles/material-styles.css' ],
    templateUrl: './btn-toggle.template.html',
    animations : [
        trigger('clickResp', [
            //state('hide',   style({'transform':'translate(-50%, -50%) scale(0)', opacity: 0})),
            transition('void => *', animate('50ms ease-out')),
            transition('* => *', animate('0.5s ease-out', keyframes([
                style({transform: 'translate(-50%, -50%) scale(0)', opacity: 0.5, offset: 0}),
                style({transform: 'translate(-50%, -50%) scale(1)', opacity: 0, offset: 1.0}),
            ]))),
        ]),
    ],
})
export class ButtonToggle {
    // Component Inputs
    @Input() public model: boolean = false;
    @Input() public cssClass: string = '';
    @Input() public color: string = 'blue';
    @Input() public primary: string = 'C500';
    @Input() public secondary: string = 'C600';
    @Input() public type: string = '';
    @Input() public btnType: string = 'flat';
    @Input() public styles: any = {};
    @Input() public disabled: boolean = false;
    // Output emitters
    @Output() public tapped = new EventEmitter();
    @Output() public modelChange = new EventEmitter();

    public  btn_class = `aca btn`;

    // Template Elements
    @ViewChild('btnContainer') private container: ElementRef;
    @ViewChild('btn') private button: ElementRef;

    private click_state: string = 'show';
    private action_btn: boolean = false;
    private last_styles: string = '';
    private hover: boolean = false;
    private active: boolean = false;
    private base_class: string = 'aca btn';

    constructor(private renderer: Renderer) {
    }

    public ngAfterViewInit() {
        this.base_class = `aca btn ${this.cssClass}`;
        this.updateClasses();
    }
    /**
     * Sets the hover state of the button
     * @return {void}
     */
     public setHover(state: boolean = false) {
         this.hover = state;
         this.updateClasses();
     }

    /**
     * Sets the hover state of the button
     * @return {void}
     */
     public setActive(state: boolean = false) {
         this.active = state;
         this.updateClasses();
     }

     public ngOnChanges(changes: any) {
         if (changes.color || changes.primary || changes.secondary || changes.btnType) {
             this.action_btn = this.btnType ? this.btnType.indexOf('action') >= 0 : false;
             this.updateClasses();
         }
         if (changes.cssClass || changes.model) {
             this.base_class = `aca btn ${this.cssClass}`;
             this.updateClasses();
         }
     }

     public ngDoCheck() {
         const s = JSON.stringify(this.styles);
         if (this.button && this.styles && this.last_styles !== s) {
             const btn = this.button.nativeElement;
             this.last_styles = s;
             for (const p in this.styles) {
                 let name: any = p.split('-');
                 name.forEach((str, index) => { if (index > 0) str[0] = str[0].toUpperCase(); });
                 name = name.join('');
                 const style = this.button.nativeElement.style;
                 if (name in style) {
                     this.renderer.setElementStyle(btn, name, this.styles[name]);
                 }
             }
         }
     }

    /**
     * Called when the button is clicked
     * @return {void}
     */
     public clicked() {
         if (this.disabled) return;
         this.click_state = (this.click_state === 'show' ? 'hide' : 'show');
         this.toggle();
         this.tapped.emit(this.model);
     }

     public toggle() {
         this.model = !this.model;
         this.modelChange.emit(this.model);
         this.updateClasses();
     }

     private updateClasses() {
         setTimeout(() => {
             if (this.cssClass && this.cssClass !== '') {
                 const el_class = `${this.base_class}`;
             } else {
                 const el_class_c_p = `color bg-${this.color}-${this.primary} font-white`;
                 const el_class_c_s = `color bg-${this.color}-${this.secondary} font-white`;
                 const el_class_step = `step-${this.active ? 'two' : 'one'}`;
                 const el_class_color = this.hover ? el_class_c_s : el_class_c_p ;
                 this.btn_class = `${this.base_class} ${this.model ? el_class_color : ''} ${el_class_step}`;
             }
         }, 10);
     }

 }
