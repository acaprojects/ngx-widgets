/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   15/09/2016 12:32 PM
 * @Email:  alex@yuion.net
 * @Filename: btn.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 07/02/2017 11:51 AM
 */

 import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
 import { ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
 import { animate, keyframes, state, style, transition, trigger } from '@angular/core';
 import { Observable } from 'rxjs/Rx';

 @Component({
     selector: 'btn',
     styleUrls: [ './btn.styles.css', '../../material-styles/material-styles.css' ],
     templateUrl: './btn.template.html',
     changeDetection: ChangeDetectionStrategy.OnPush,
     animations : [
         trigger('clickResp', [
             // state('hide',   style({'transform':'translate(-50%, -50%) scale(0)', opacity: 0})),
             transition('void => *', animate('50ms ease-out')),
             transition('* => *', animate('0.5s ease-out', keyframes([
                     style({transform: 'translate(-50%, -50%) scale(0)', opacity: 0.5, offset: 0}),
                     style({transform: 'translate(-50%, -50%) scale(1)', opacity: 0, offset: 1.0}),
             ]))),
         ]),
     ],
 })
 export class Button {
     // Component Inputs
     @Input() public cssClass: string = '';
     @Input() public color: string = 'blue';
     @Input() public primary: string = 'C500';
     @Input() public secondary: string = 'C600';
     @Input() public type: string = '';
     @Input() public btnType: string = 'raised';
     @Input() public styles: any = {};
     @Input() public disabled: boolean = false;
     // Output emitters
     @Output() public tapped = new EventEmitter();

     public action_btn: boolean = false;
     public active: boolean = false;
     public hover: boolean = false;
     public click_state: string = 'show';
     public btn_class: string = 'aca btn color';

     // Template Elements
     @ViewChild('btnContainer') private container: ElementRef;
     @ViewChild('btn') private button: ElementRef;

     private base_class: string = 'aca btn';
     private last_styles: string = '';

     constructor(private renderer: Renderer2) {
     }

     public ngOnInit() {
         setTimeout(() => {
             this.updateClasses();
         }, 20);
     }

     public ngAfterViewInit() {
         // this.updateClasses();
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
         if (changes.color || changes.primary || changes.secondary || changes.btnType || changes.disabled) {
             this.action_btn = this.btnType ? this.btnType.indexOf('action') >= 0 : false;
         }
         if (changes.cssClass || changes.btnType) {
             this.base_class = `aca btn ${this.btnType} ${this.cssClass}`;
         }
         this.updateClasses();
     }

     public ngDoCheck() {
         const s = JSON.stringify(this.styles);
         if (this.button && this.styles && this.last_styles !== s) {
             const btn = this.button.nativeElement;
             this.last_styles = s;
             for (const p in this.styles) {
                 if (!(this.styles[p] instanceof Function)) {
                     this.renderer.setStyle(btn, p, this.styles[p]);
                 }
             }
         }
     }

    /**
     * Called when the button is clicked
     * @return {void}
     */
     public clicked() {
         if (this.disabled) {
             return;
         }
         this.click_state = (this.click_state === 'show' ? 'hide' : 'show');
         this.tapped.emit();
     }

     private updateClasses() {
         if (this.cssClass && this.cssClass !== '') {
             this.btn_class = `${this.base_class}`;
         } else {
             const el_class_c_p = `color bg-${this.color}-${this.primary} font-white`;
             const el_class_c_s = `color bg-${this.color}-${this.secondary} font-white`;
             const el_class_step = this.btnType === 'flat' ? `` : `step-${this.active ? 'two' : 'one'}`;
             const el_class_color = this.hover ? el_class_c_s : el_class_c_p ;
             this.btn_class = `${this.base_class} ${this.disabled ? '' : el_class_color} ${el_class_step}`;
         }
     }

 }
