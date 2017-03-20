/**
* @Author: Alex Sorafumo
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: time-dialog.component.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 19/12/2016 4:40 PM
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
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
            transition('* <=> *', animate('0.5s ease-out'))
        ]),
        trigger('space', [
            state('hide', style({ transform: 'translate(-50%, -50%) scale(0)'})),
            state('show', style({ transform: 'translate(-50%, -50%) scale(1.0)'})),
            transition('* <=> *', animate('0.2s ease-out')),
            transition('void => *', animate('0.2s ease-out'))
        ])
    ]
})
export class TimeDialog extends Modal {
    @Input() time: { h: number, m: number } = { h: 12, m: 15 };

    confirm: any = { text: 'OK', fn: null };
    cancel:  any = { text: 'CANCEL', fn: null };

    hours: number[] = [];
    minutes: number[] = [];

    ngOnInit() {
        this.hours = [];
        this.minutes = [];
        for(let i = 0; i < 12; i++) {
            this.hours.push(i+1);
            this.minutes.push((i+1 * 5)%60);
        }
    }

    setParams(data: any) {
        super.setParams(data);
        if(data && data.data && data.data.time) this.time = data.data.time;
        this.canClose = true;
        if(data && data.options){
            for(let i = 0; i < data.options.length; i++) {
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
