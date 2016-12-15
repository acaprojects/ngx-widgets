/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   15/09/2016 12:37 PM
* @Email:  alex@yuion.net
* @Filename: toggle.component.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:29 AM
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
            state('disabled', style({ 'background-color': '#DCDCDC' })),
            transition('* => *', animate('100ms ease-out'))
        ]),
        trigger('textToggle', [
            state('on', style({left: '50%'})),
            state('off', style({left: '0%'})),
            transition("on <=> off", animate('100ms ease-out'))
        ]),
        trigger('iosToggle', [
            state('on', style({left: '33%'})),
            state('off', style({left: '2.5%'})),
            transition('* => off', animate('100ms ease-out', keyframes([
                style({left: '33%', offset: 0}), style({left: '2.5%', offset: 1.0})
            ]))),
            transition('* => on', animate('100ms ease-out', keyframes([
                style({left: '2.5%', offset: 0}), style({left: '33%', offset: 1.0})
            ])))
        ])
    ]
})
export class Toggle {
    @Input() type: string;
    @Input() state: boolean = true;
    @Input() active: string;
    @Input() inactive: string;
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
    tstate: string;

    constructor(){
        this.tstate = this.state ? 'on' : 'off';
    }

    ngInit(){
    }

    ngAfterContentInit(){
        this.initElements();
        this.updateValue(true);
    }

    ngOnChanges(changes: any){
        this.initElements();
        if(changes.state) this.tstate = this.state ? 'on' : 'off';
        if(changes.disabled) this.tstate = this.disabled ? 'disabled' : (this.state ? 'on' : 'off');
    }

    initElements(){
        this.toggle = this.type === 'text' ? this.tknob : this.sknob;
            //Setup Interactive Events
        //*
    }

    changeState(event: any){
        if(this.disabled) return;
  		if (event.stopPropagation) event.stopPropagation();
		else event.cancelBubble = true;
        this.state = !this.state;
        this.stateChange.emit(this.state);
    }

    updateValue(update: boolean = false){

    }
}
