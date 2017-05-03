/**
 * @Author: Alex Sorafumo
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: confirm-dialog.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 19/12/2016 4:52 PM
 */

import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';
import { ModalService } from '../../../../services';
import { Modal } from '../../modal.component';

const PLACEHOLDER = '-';

@Component({
    selector: '[confirm-dialog]',
    styleUrls: [ './confirm-dialog.styles.css', '../../../material-styles/material-styles.css' ],
    templateUrl: './confirm-dialog.template.html',
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
export class ConfirmDialog extends Modal {
    msg: string = 'Are you sure?';
    confirm: string = 'Ok';

    @ViewChild('content') content: ElementRef;

    setParams(data: any) {
        super.setParams(data);
        this.canClose = true;
    }
}
