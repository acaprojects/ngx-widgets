/**
* @Author: Alex Sorafumo
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: confirm-dialog.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 19/12/2016 4:52 PM
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { ModalService } from '../../../../services';
import { Modal } from '../../modal.component';

const PLACEHOLDER = '-';

@Component({
    selector: '[confirm-dialog]',
    styleUrls: [ './confirm-dialog.styles.css', '../../../material-styles/material-styles.css' ],
    templateUrl: './confirm-dialog.template.html',
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
export class ConfirmDialog extends Modal {
    msg: string = 'Are you sure?';
    confirm: string = 'Ok';

    @ViewChild('content') content: ElementRef;

    setParams(data: any) {
    	super.setParams(data);
    	this.canClose = true;
    }
}
