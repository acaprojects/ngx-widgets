import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';


@Component({
    selector: 'spinner', 
    styles: [ require('./spinner.style.scss') ],
    templateUrl: './spinner.template.html',
    animations: [
        trigger('plane', [
            state('one',   style({'opacity':1})),
            state('two',   style({'opacity':1})),
            transition('* <=> *', animate('1.2s ease-in-out', keyframes([
                style({'transform': 'perspective(6.0em) rotateX(0deg) rotateY(0deg)', offset: 0}), 
                style({'transform': 'perspective(6.0em) rotateX(-180.1deg) rotateY(0deg)', offset: 0.45}),
                style({'transform': 'perspective(6.0em) rotateX(-180.1deg) rotateY(0deg)', offset: 0.55}),
                style({'transform': 'perspective(6.0em) rotateX(-180.1deg) rotateY(-179.9deg)', offset: 1})
            ])))
        ]),
        trigger('fade', [
            state('one',   style({'opacity':0})),
            state('two',   style({'opacity':0})),
            transition('* <=> *', animate('1.2s ease-in-out', keyframes([
                style({ opacity: 0, offset: 0}), 
                style({ opacity: 1, offset: 0.33}),
                style({ opacity: 1, offset: 0.66}),
                style({ opacity: 0, offset: 1})
            ])))
        ]),
        trigger('fadeOut', [
            state('one',   style({'opacity':1})),
            state('two',   style({'opacity':1})),
            transition('* <=> *', animate('0.8s ease-in-out', keyframes([
                style({ opacity: 1, offset: 0}),
                style({ opacity: 0, offset: 1})
            ])))
        ]),
        trigger('bounce', [
            state('one',   style({'opacity':1})),
            state('two',   style({'opacity':1})),
            transition('* <=> *', animate('1.2s ease-in-out', keyframes([
                style({'transform': 'scale(0.0)', opacity: 1, offset: 0}), 
                style({'transform': 'scale(1.0)', opacity: 0, offset: 1})
            ])))
        ]),
        trigger('scale', [
            state('one',   style({'transform': 'scale(0)'})),
            state('two',   style({'transform': 'scale(0)'})),
            transition('* <=> *', animate('2.0s ease-in-out', keyframes([
                style({'transform': 'scale(0.0)', offset: 0}), 
                style({'transform': 'scale(1.0)', offset: 0.5}),
                style({'transform': 'scale(0.0)', offset: 1})
            ])))
        ]),
        trigger('scaleOut', [
            state('one',   style({'transform': 'scale(1.0)'})),
            state('two',   style({'transform': 'scale(1.0)'})),
            transition('* <=> *', animate('1.0s ease-in-out', keyframes([
                style({'transform': 'scale(1.0)', offset: 0}), 
                style({'transform': 'scale(0.0)', offset: 1})
            ])))
        ]),
        trigger('dbounce1', [
            state('one',   style({'transform': 'scale(0)', 'opacity':0.5})),
            state('two',   style({'transform': 'scale(0)', 'opacity':0.5})),
            transition('* <=> *', animate('1.2s ease-out', keyframes([
                style({'transform': 'scale(0.0)', offset: 0}), 
                style({'transform': 'scale(1.0)', offset: 0.5}), 
                style({'transform': 'scale(0.0)', offset: 1})
            ])))
        ]),
        trigger('dbounce2', [
            state('one',   style({'opacity':0.5})),
            state('two',   style({'opacity':0.5})),
            transition('* <=> *', animate('2.0s ease-out', keyframes([
                style({'transform': 'scale(1.0)', offset: 0}), 
                style({'transform': 'scale(0)', offset: 0.5}), 
                style({'transform': 'scale(1.0)', offset: 1})
            ])))
        ]),
        trigger('bars', [
            state('one',   style({transform: 'scaleY(0.4)'})),
            state('two',   style({transform: 'scaleY(0.4)'})),
            transition('void => *', animate('0.1s ease-in-out', keyframes([
                style({'transform': 'scaleY(0.4)', offset: 0}), 
                style({'transform': 'scaleY(0.4)', offset: 1})
            ]))),
            transition('* <=> *', animate('1.6s ease-out', keyframes([
                style({'transform': 'scaleY(0.4)', offset: 0}), 
                style({'transform': 'scaleY(1.0)', offset: 0.25}), 
                style({'transform': 'scaleY(0.4)', offset: 0.5}), 
                style({'transform': 'scaleY(0.4)', offset: 0.75}), 
                style({'transform': 'scaleY(0.4)', offset: 1})
            ])))
        ]),
        trigger('cubemove', [
            state('one',   style({transform: 'translateX(-2.0em) translateY(-2.0em)'})),
            state('two',   style({transform: 'translateX(-2.0em) translateY(-2.0em)'})),
            transition('void => *', animate('0.1s ease-in-out', keyframes([
                style({'transform': 'translateX(-2.0em) translateY(-2.0em)', offset: 0}), 
                style({'transform': 'translateX(-2.0em) translateY(-2.0em)', offset: 1})
            ]))),
            transition('* <=> *', animate('1.8s ease-in-out', keyframes([
            	style({ transform: 'translateX(-2.0em) translateY(-2.0em)', offset: 0 }),
                style({ transform: 'translateX(2.0em)  translateY(-2.0em)', offset: 0.2 }), 
                style({ transform: 'translateX(2.0em)  translateY(2.0em)', offset: 0.4 }), 
                style({ transform: 'translateX(-2.0em) translateY(2.0em)', offset: 0.6 }),
                style({ transform: 'translateX(-2.0em) translateY(2.0em)', offset: 0.8 }),
                style({ transform: 'translateX(-2.0em) translateY(-2.0em)', offset: 1 })
            ])))
        ])
    ]
})
export class Spinner {
	@Input() type: string = 'plane';
	@Input() color: string = '#FFF';

	state: string = 'one';
	timeout = {
		plane: 1200,
		bounce: 1000,
		'double-bounce': 2000,
		bars: 1600,
		cubemove: 1800,
		'dot-circle': 2000,
		'dot-circle-scale': 2000,
		'dot-bounce': 2000
	};

	dots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

	states = [
		'one', 'one', 'one', 'one', 
		'one', 'one', 'one', 'one', 
		'one', 'one', 'one', 'one', 
		'one', 'one', 'one', 'one'
	];
	bar_count = 6;

	constructor() {
	}

	ngOnInit() {
		setInterval(() => { this.updateState(); }, this.timeout[this.type] + 10);
	}

	ngOnChanges() {
		if(this.type === null || this.type === undefined) this.type = 'plane';
	}

	updateState() {
		this.state = this.state === 'one' ? 'two' : 'one';
		switch(this.type) {
			case 'bars':
				if(!this.updating) this.updateMultiState(10);
				break;
			case 'cubemove':
				for(let i = 0; i < 8; i++) {
					setTimeout(() => { this.states[i] = this.state; }, 400 * i);
				}
				break;
			case 'dot-bounce':
				if(!this.updating) this.updateMultiState(5);
				break;
			case 'dot-circle':
				if(!this.updating) this.updateMultiState(12);
				break;
			case 'dot-circle-scale':
				if(!this.updating) this.updateMultiState(12);
				break;
		}
	}

	update = 0;
	updating = false;

	updateMultiState(mod:number) {
		this.updating = true;
		setTimeout((val) => {
			this.states[val] = this.states[val] === 'one' ? 'two' : 'one';
			this.updateMultiState(mod);
		}, Math.floor(this.timeout[this.type] / mod), this.update);
		this.update++;
		this.update %= mod;
	}
}
