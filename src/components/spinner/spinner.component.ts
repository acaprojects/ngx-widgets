import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'spinner', 
    styles: [ require('./spinner.style.scss') ],
    templateUrl: './spinner.template.html'
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
