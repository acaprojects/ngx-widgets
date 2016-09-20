import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';
import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { RuntimeCompiler } from "@angular/compiler";
import { Modal } from '../../modal.component';

import { IHaveDynamicData, DynamicTypeBuilder } from '../../../dynamic/type.builder';

const PLACEHOLDER = '-';

@Component({
    selector: '[simple-modal]',
    styles: [ require('./simple-modal.styles.scss'), require('../../../global-styles/global-styles.scss') ],
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

    @ViewChild('modal') protected modal: ElementRef;
    @ViewChild('content', { read: ViewContainerRef }) protected _content: ViewContainerRef;

    constructor(
    	protected _cfr: ComponentFactoryResolver,
        protected typeBuilder: DynamicTypeBuilder,
        protected compiler: RuntimeCompiler
    ) {
        super(_cfr, typeBuilder, compiler);
    }
}
