/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: alert-dialog.component.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:31 AM
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { ModalService } from '../../../../services';
import { Modal } from '../../modal.component';

const PLACEHOLDER = '-';

@Component({
    selector: '[alert-dialog]',
    styleUrls: [ './alert-dialog.styles.css', '../../../material-styles/material-styles.css' ],
    templateUrl: './alert-dialog.template.html',
    animations: [
        trigger('backdrop', [
            state('hide',   style({'opacity' : '0'})),
            state('show', style({'opacity' : '1' })),
            transition('* => hide', animate('0.5s ease-out', keyframes([
                style({'bac' : '1', offset: 0}), style({'opacity' : '0', offset: 1.0})
            ]))),
            transition('* => show', animate('0.5s ease-in', keyframes([
                style({'opacity' : '0', offset: 0}), style({'opacity' : '1', offset: 1.0})
            ])))
        ]),
        trigger('space', [
            state('hide',   style({ 'left': '100%', 'opacity' : '0'})),
            state('show', style({ 'left':   '50%', 'opacity' : '1' })),
            transition('* => hide', animate('0.5s ease-out', keyframes([
                style({'left': '50%', 'opacity' : '1', offset: 0}), style({'left': '100%', 'opacity' : '0', offset: 1.0})
            ]))),
            transition('* => show', animate('0.5s ease-in', keyframes([
                style({'left': '100%', 'opacity' : '0', offset: 0}), style({'left': '50%', 'opacity' : '1', offset: 1.0})
            ])))
        ])
    ]
})
export class AlertDialog extends Modal {
	confirm: any = { text: 'OK', fn: null };
	cancel:  any = { text: 'CANCEL', fn: null };

    constructor(public _cfr: ComponentFactoryResolver) {
        super(_cfr);
    }

    setParams(data: any) {
    	super.setParams(data);
    	this.close = true;
    	if(data && data.options){
    		for(let i = 0; i < data.options; i++) {
    			let option = data.options[i];
    			if(option.type === 'confirm') {
    				this.confirm = option;
    			} else if(option.type === 'cancel') {
    				this.cancel = option;
    			}
    		}
    	}
    }
}
