/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: notification.directive.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:33 AM
*/

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
