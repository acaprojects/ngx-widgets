/**
 * @Author: Alex Sorafumo
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: alert-dialog.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 19/12/2016 4:39 PM
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ComponentFactoryResolver, Renderer } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';
import { ModalService } from '../../../../services';
import { Modal } from '../../modal.component';

const PLACEHOLDER = '-';

@Component({
    selector: '[alert-dialog]',
    styleUrls: [ './alert-dialog.styles.css', '../../../material-styles/material-styles.css' ],
    templateUrl: './alert-dialog.template.html',
    animations: [
        trigger('backdrop', [
            state('hide', style({ opacity : 0 })),
            state('show', style({ opacity : 1 })),
            transition('* <=> *', animate('0.5s ease-out')),
        ]),
        trigger('space', [
            state('hide', style({ transform: 'translate(-50%, -50%) scale(0)'})),
            state('show', style({ transform: 'translate(-50%, -50%) scale(1.0)'})),
            transition('* <=> *', animate('0.2s ease-out')),
            transition('void => *', animate('0.2s ease-out')),
        ]),
    ],
})
export class AlertDialog extends Modal {

    public setParams(data: any) {
        super.setParams(data);
        this.canClose = true;
    }
}
