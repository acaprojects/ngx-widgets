/**
 * @Author: Alex Sorafumo
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: time-dialog.component.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 19/12/2016 4:40 PM
 */

import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';
import { ModalService } from '../../../../services';
import { Modal } from '../../modal.component';

const PLACEHOLDER = '-';

@Component({
    selector: 'time-dialog',
    styleUrls: [ './time-dialog.styles.css', '../../../material-styles/material-styles.css' ],
    templateUrl: './time-dialog.template.html',
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
export class TimeDialog extends Modal {
    @Input() public time: { h: number, m: number } = { h: 12, m: 15 };

    public hours: number[] = [];
    public minutes: number[] = [];

    public ngOnInit() {
        this.hours = [];
        this.minutes = [];
        for (let i = 0; i < 12; i++) {
            this.hours.push(i + 1);
            this.minutes.push((i + 1 * 5) % 60);
        }
    }

    public setParams(data: any) {
        super.setParams(data);
        if (data && data.data && data.data.time) {
            this.time = data.data.time;
        }
        this.canClose = true;
    }
}
