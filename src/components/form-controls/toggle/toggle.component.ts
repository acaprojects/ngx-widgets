/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   15/09/2016 12:37 PM
 * @Email:  alex@yuion.net
 * @Filename: toggle.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 30/01/2017 10:06 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';

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
            transition('* => *', animate('100ms ease-out')),
        ]),
        trigger('textToggle', [
            state('on', style({left: '50%'})),
            state('off', style({left: '0%'})),
            state('On', style({left: '50%'})),
            state('Off', style({left: '0%'})),
            transition('on <=> off', animate('100ms ease-out')),
        ]),
        trigger('iosToggle', [
            state('on', style({left: '100%'})),
            state('off', style({left: '0'})),
            state('On', style({left: '100%'})),
            state('Off', style({left: '0'})),
            transition('on <=> off', animate('100ms ease-out')),
        ]),
    ],
})
export class Toggle {
    @Input() public type: string;
    @Input() public state: boolean = true;
    @Input() public active: string = 'On';
    @Input() public inactive: string = 'Off';
    @Input() public view: string = 'square';
    @Input() public disabled: boolean = false;
    @Input() public size: string = '1.0em';
    @Input() public colorYes: string = 'green';
    @Input() public primaryYes: string = 'C500';
    @Input() public colorNo: string = 'red';
    @Input() public primaryNo: string = 'C500';
    @Output() public stateChange = new EventEmitter();

    protected _state: boolean = true;
        // Toggle Knob
    @ViewChild('iosToggle')  private sknob: any;
    @ViewChild('textToggle') private tknob: any;

    private toggle: ElementRef;
    private state_timer: any = null;

    public ngAfterViewInit() {
        this.initElements();
    }

    public ngOnChanges(changes: any) {
        if (changes.type) {
            this.initElements();
        }
        if (changes.state) {
            if (this.state === undefined || this.state === null) {
                this.state = false;
            }
            this._state = (typeof this.state === 'boolean' ? this.state : this._state);
        }
    }
    /**
     * Changes the toggles state from on -> off and vice versa
     * @param  {any}    event Click/Tap Event
     * @return {void}
     */
    public changeState(event: any) {
        if (this.disabled) {
            return;
        }
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
        this._state = !this._state;
        this.state = this._state;
        setTimeout(() => {
            this.stateChange.emit(this._state);
        }, 200);
    }
    /**
     * Sets the toggle knob
     * @return {void}
     */
    private initElements() {
        this.toggle = this.type === 'text' ? this.tknob : this.sknob;
    }
}
