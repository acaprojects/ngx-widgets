/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: index.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:32 AM
*/

import { TABS_COMPONENTS } from './tab-group';
import { STEPPER_COMPONENTS } from './stepper';

export * from './tab-group';
export * from './stepper';

export const PAGE_CONTROLS: any[] = [
	TABS_COMPONENTS, 
	STEPPER_COMPONENTS
];