import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'; 
import { ComponentResolver, ComponentRef, ReflectiveInjector, ResolvedReflectiveProvider, ViewContainerRef, OnInit, Type } from '@angular/core';
import { NgTemplateOutlet, FORM_DIRECTIVES } from '@angular/common';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { ModalService } from '../../modal.service';
import { Modal } from '../../modal.component';

const PLACEHOLDER = '-';

@Component({
    selector: '[confirm-dialog]', 
    styles: [ require('./confirm-dialog.styles.scss'), require('../../../global-styles/global-styles.scss') ],
    templateUrl: './confirm-dialog.template.html',
    directives: [ NgTemplateOutlet ],
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

}
