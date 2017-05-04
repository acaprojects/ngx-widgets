/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   20/09/2016 12:24 PM
 * @Email:  alex@yuion.net
 * @Filename: simple-modal.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:31 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';
import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Modal } from '../../modal.component';

import { DynamicTypeBuilder, IHaveDynamicData } from '../../../../services';

const PLACEHOLDER = '-';

@Component({
    selector: 'simple-modal',
    styleUrls: [ './simple-modal.styles.css', '../../../material-styles/material-styles.css' ],
    templateUrl: './simple-modal.template.html',
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
export class SimpleModal extends Modal {
    @Input() public colors: any = { fg: '#fff', bg: '#000' };

}
