import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../services';

@Directive({
	selector: '[notification]'
})
export class NotificationDirective {
		// Inputs
	@Input() message: string;
	@Input() cssClass: string;
	@Input() options: any;
		// Outputs

	constructor(private service: NotificationService) {

	}

	ngOnInit() {
		setTimeout(() => {
			this.service.add(this.message, this.cssClass, this.options);
		}, 100);
	}
}
