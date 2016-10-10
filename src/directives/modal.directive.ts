import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../services';

@Directive({
	selector: '[modal]'
})
export class ModalDirective {
		// Inputs
	@Input() title: string = 'Modal';
	@Input() id: string;
	@Input() close: boolean = false;
	@Input() html: string = '';
	@Input() data: any = {};
	@Input() options: any[];
	@Input() size: string = '';
	@Input() styles: string[] = [];
	@Input() colors: { fg: string, bg: string };
	@Input() active: boolean = false;
		// Outputs
	@Output() activeChange = new EventEmitter();
	@Output() ok = new EventEmitter();
	@Output() cancel = new EventEmitter();

	constructor(private service: ModalService) {
		if(!this.id || this.id === '') this.id = Math.floor(Math.random() * 89999999 + 10000000).toString();
	}

	ngOnChanges(changes: any) {
		if(changes) {
			this.service.setup(this.id, {
				title: this.title,
				html: this.html,
				close: this.close,
				options: this.options,
				size: this.size,
				styles: this.styles,
				colors: this.colors
			})
		}
		if(changes.active) {
			if(this.active) this.id = this.service.open(this.id, { data: this.data });
			else this.service.close(this.id);
		}
	}

	ngOnInit() {
		if(!this.options) this.options = [
			{ text: 'Ok', fn: (data: any, cb_fn: any) => { this.onOk(data, cb_fn) } },
			{ text: 'Cancel', fn: (data: any, cb_fn: any) => { this.onCancel(data, cb_fn) } }
		];
	}

	onOk(data: any, cb_fn: Function) {
		console.log(data);
		this.ok.emit(data);
		if(cb_fn) cb_fn();
	}

	onCancel(data: any, cb_fn: Function) {
		this.cancel.emit(this.data);
		if(cb_fn) cb_fn();
	}
}
