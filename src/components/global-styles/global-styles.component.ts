import { Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'global-styles',
	encapsulation: ViewEncapsulation.None,
	styles: [ require('./global-styles.scss') ],
	template: `` 
})
export class GlobalStyles {

}