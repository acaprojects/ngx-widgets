/*
* @Author: Alex Sorafumo
* @Date:   2017-03-10 11:56:00
* @Last Modified by:   Alex Sorafumo
* @Last Modified time: 2017-03-10 12:17:24
*/

import { Component, Renderer } from '@angular/core';

@Component({
	selector: 'aca-widget',
	template: '<div class="widget"></div>'
})
export class WidgetComponent {
	protected theme: any = {};
	protected component_name: string = 'widget';
	protected theme_sub: any = null;
	protected cmp_elements: any = {};

	constructor(private theme_service: WidgetThemeService, private renderer: Renderer) {
		this.theme_sub = theme_service.listener().subscribe((theme) => {
			this.theme = theme;
			this.updateTheme();
		}, (err) => {}, () => {});
	}

	updateTheme() {
		if(this.theme && this.theme[this.component_name]) {
			let theme = this.theme[this.component_name];
			for(let el in theme) {
				if(this.cmp_elements[el]) {
					for(let style in theme[el]) {
						this.renderer.setElementStyle(this.cmp_elements[el], style, theme[el][style]);
					}
				}
			}
		}
	}

	ngAfterViewInit() {
		this.updateTheme();
	}

	ngOnDestory() {

	}
}