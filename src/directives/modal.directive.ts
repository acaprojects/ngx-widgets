/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: modal.directive.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:33 AM
*/

import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../services';

@Directive({
	selector: '[modal]'
})
export class ModalDirective {
		// Inputs
	@Input() title: string = 'Modal';
	@Input() id: string;
	@Input() cmp: string = '';
	@Input() active: boolean = false;
	@Input() data: any = null;
		// Outputs
	@Output() activeChange = new EventEmitter();
	@Output() event = new EventEmitter();
	@Output() error = new EventEmitter();

	constructor(private service: ModalService) {
		if(!this.id || this.id === '') this.id = Math.floor(Math.random() * 89999999 + 10000000).toString();
	}

	ngOnInit() {

	}

	ngOnChanges(changes: any) {
		if(changes) {
				// Setup modal
			this.service.setup(this.id, {
				title: this.title,
				cmp: this.cmp
			})
		}
		if(changes.active) {
			if(this.active) {
				this.service.open(this.id, { data: this.data }).subscribe(
					data => this.event.emit(), 
					err => this.error.emit(),
					() => {}
				);
			}else {
				this.service.close(this.id);
			}
		}
	}

}
