/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   15/09/2016 12:37 PM
* @Email:  alex@yuion.net
* @Filename: toggle.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 30/01/2017 10:06 AM
*/

import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';

@Component({
    selector: 'toggle',
    templateUrl: './toggle.template.html',
    styleUrls: [ './toggle.styles.css' ],
    animations: [
        trigger('toggleBg', [
            state('on', style({ 'background-color': '#23CE6B' })),
            state('off', style({ 'background-color': '#F64740' })),
            state('On', style({ 'background-color': '#23CE6B' })),
            state('Off', style({ 'background-color': '#F64740' })),
            state('disabled', style({ 'background-color': '#DCDCDC' })),
            transition('* => *', animate('100ms ease-out'))
        ]),
        trigger('textToggle', [
            state('on', style({left: '50%'})),
            state('off', style({left: '0%'})),
            state('On', style({left: '50%'})),
            state('Off', style({left: '0%'})),
            transition("on <=> off", animate('100ms ease-out'))
        ]),
        trigger('iosToggle', [
            state('on', style({left: '100%'})),
            state('off', style({left: '0'})),
            state('On', style({left: '100%'})),
            state('Off', style({left: '0'})),
            transition('on <=> off', animate('100ms ease-out'))
        ])
    ]
})
export class Toggle {
    @Input() type: string;
    @Input() state: boolean = true;
    @Input() active: string = "On";
    @Input() inactive: string = "Off";
    @Input() view: string = 'square';
    @Input() disabled: boolean = false;
    @Input() size: string = '1.0em';
    @Input() colorYes: string = 'green';
    @Input() primaryYes: string = 'C500';
    @Input() colorNo: string = 'red';
    @Input() primaryNo: string = 'C500';
    @Output() stateChange = new EventEmitter();
    //*
        //Toggle Knob
    @ViewChild('iosToggle')  sknob:any;
    @ViewChild('textToggle') tknob:any;

    toggle: ElementRef;
    protected _state: boolean = true;
    private state_timer: any = null;

    constructor(){
    }

    ngInit(){
    }

    ngAfterViewInit(){
        this.initElements();
    }

    ngOnChanges(changes: any){
        if(changes.type) {
            this.initElements();
        }
        if(changes.state) {
            if(this.state === undefined || this.state === null) this.state = false;
            this._state = (typeof this.state === 'boolean' ? this.state : this._state);
        }
    }
    /**
     * Sets the toggle knob
     * @return {void}
     */
    initElements(){
        this.toggle = this.type === 'text' ? this.tknob : this.sknob;
    }
    /**
     * Changes the toggles state from on -> off and vice versa
     * @param  {any}    event Click/Tap Event
     * @return {void}
     */
    changeState(event: any){
        console.log(this.state);
        if(this.disabled) return;
          if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
        this._state = !this._state;
        this.state = this._state;
        setTimeout(() => {
            this.stateChange.emit(this._state);
        }, 200);
    }
}
