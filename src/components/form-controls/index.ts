/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   15/09/2016 11:48 AM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:30 AM
 */

import { Calendar } from './calendar';
import { CheckboxComponent } from './checkbox';
import { DataInput } from './data-input';
import { DropdownComponent } from './dropdown';
import { Slider } from './slider';
import { TimePicker } from './time-picker';
import { Toggle } from './toggle';

export * from './calendar';
export * from './checkbox';
export * from './data-input';
export * from './dropdown';
export * from './slider';
export * from './time-picker';
export * from './toggle';

export const FORM_CONTROLS: any[] = [
    Calendar,
    CheckboxComponent,
    DataInput,
    DropdownComponent,
    Slider,
    TimePicker,
    Toggle,
];
