/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   15/09/2016 11:48 AM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:30 AM
 */

import { CalendarComponent } from './calendar';
import { CheckboxComponent } from './checkbox';
import { CustomDropdownComponent } from './custom-dropdown';
import { DataInput } from './data-input';
import { DropdownComponent } from './dropdown';
import { RadioButtonComponent, RadiosetComponent } from './radioset';
import { Slider } from './slider';
import { TimePicker } from './time-picker';
import { Toggle } from './toggle';

export * from './calendar';
export * from './checkbox';
export * from './custom-dropdown';
export * from './data-input';
export * from './dropdown';
export * from './radioset';
export * from './slider';
export * from './time-picker';
export * from './toggle';

export const FORM_CONTROLS: any[] = [
    CalendarComponent,
    CheckboxComponent,
    CustomDropdownComponent,
    DataInput,
    DropdownComponent,
    RadioButtonComponent,
    RadiosetComponent,
    Slider,
    TimePicker,
    Toggle,
];
