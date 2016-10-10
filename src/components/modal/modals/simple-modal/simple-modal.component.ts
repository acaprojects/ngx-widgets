import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Modal } from '../../modal.component';

import { IHaveDynamicData, DynamicTypeBuilder } from '../../../../services';

const PLACEHOLDER = '-';

@Component({
    selector: 'simple-modal',
    styleUrls: [ './simple-modal.styles.css', '../../../material-styles/material-styles.css' ],
    templateUrl: './simple-modal.template.html',
    animations: [
        trigger('backdrop', [
            state('hide',   style({'opacity' : '0'})),
            state('show', style({'opacity' : '1' })),
            transition('* => hide', animate('0.5s ease-out')),
            transition('* => show', animate('0.5s ease-in'))
        ]),
        trigger('space', [
            state('hide',   style({ 'left': '100%', 'opacity' : '0'})),
            state('show', style({ 'left':   '50%', 'opacity' : '1' })),
            transition('* => hide', animate('0.5s ease-out')),
            transition('* => show', animate('0.5s ease-in'))
        ])
    ]
})
export class SimpleModal extends Modal {

    @ViewChild('modal') public modal: ElementRef;
    @ViewChild('content', { read: ViewContainerRef }) public _content: ViewContainerRef;

    constructor(
    	public _cfr: ComponentFactoryResolver
    ) {
        super(_cfr);
    }
}
