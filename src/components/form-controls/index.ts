/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   15/09/2016 11:48 AM
* @Email:  alex@yuion.net
* @Filename: index.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:30 AM
*/

import { Calendar } from './calendar';
import { DataInput } from './data-input';
import { Dropdown } from './dropdown';
import { DropdownTypeahead } from './dropdown-typeahead';
import { Slider } from './slider';
import { TimePicker } from './time-picker';
import { Toggle } from './toggle';
import { Typeahead, TypeaheadList } from './typeahead';

export * from './calendar';
export * from './data-input';
export * from './dropdown';
export * from './dropdown-typeahead';
export * from './slider';
export * from './time-picker';
export * from './toggle';
export * from './typeahead';

export const FORM_CONTROLS: any[] = [
	Calendar,
	DataInput,
	Dropdown,
	DropdownTypeahead,
	Slider,
	TimePicker,
	Toggle,
	Typeahead,
	TypeaheadList
];
