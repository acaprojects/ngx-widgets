import { Component, Input, Output } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } 	 from '@angular/core';

@Component({
    selector: 'notify-block',
    template: `
        <div [@position]="position" [id]="id" [class]="'notification ' + cssClass" >
            <div class="contents" [innerHTML]="entity?.html"></div>
            <div class="close-btn" *ngIf="entity?.canClose" (click)="entity.close()">&#x2613;</div>
        </div>
    `,
    styleUrls: [ './notify-block.styles.css' ],
    animations: [
        trigger('position', [
        	state('0', style({ bottom: '0.5em' })),
            state('1', style({ bottom: '5.0em' })),
            state('2', style({ bottom: '9.5em' })),
            state('3', style({ bottom: '14.0em' })),
            state('4', style({ bottom: '18.5em' })),
            state('5', style({ bottom: '23.0em' })),
            state('6', style({ bottom: '27.5em' })),
            state('7', style({ bottom: '32em' })),
            state('8', style({ bottom: '36.5em' })),
            state('9', style({ bottom: '41em' })),
            state('10', style({ bottom: '45.5em' })),
            state('11', style({ bottom: '50em' })),
            state('12', style({ bottom: '54.5em' })),
            state('13', style({ bottom: '59em' })),
            state('hidden', style({ opacity: 0, display: 'none' })),
            state('close', style({ opacity: 0, display: 'none' })),
        	transition('void => *', [ style({ right: '10.0em',  opacity: 0}), animate('400ms ease-out', style({ right: '0.5em', opacity: 1})) ]),
        	transition('* => close', [ style({ right: '0.5em',  opacity: 1}), animate('400ms ease-out', style({ right: '-10.0em', opacity: 0})) ]),
    	    transition('* <=> *', animate('400ms ease-out') )
        ])
    ]
})
export class NotifyBlock {
    @Input() entity: any = {};
    @Input() id: string = '';
    @Input() cssClass: string = 'default';
    @Input() position: string = '0';
    @Input() remove: boolean = false;
    remove_check: any = null;

    constructor() {
        this.id = Math.floor(Math.random() * 899999 + 100000).toString();
        this.remove_check = setInterval(() => {
            if(this.remove) {
                this.position = 'close';
            }
        }, 200);
    }

    ngOnDestroy() {
        if(this.remove_check) clearInterval(this.remove_check);
        this.position = 'close';
    }
}
