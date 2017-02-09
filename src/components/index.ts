/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   04/10/2016 11:53 AM
* @Email:  alex@yuion.net
* @Filename: index.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 07/02/2017 12:27 PM
*/

import { Button, ButtonGroup, ButtonToggle } from './buttons';
import { Calendar, DataInput, Dropdown, OldDropdown, OldDropdownList, Slider, TimePicker, Toggle, Typeahead, TypeaheadList } from './form-controls';
import { ImageCrop } from './img-crop';
import { MAP_COMPONENTS } from './interactive-map';
import { MaterialStyles } from './material-styles';
import { Modal, ACA_WIDGET_MODALS } from './modal';
import { Notification, NotifyBlock } from './notification';
import { TABS_COMPONENTS, STEPPER_COMPONENTS } from './page-controls';
import { Spinner } from './spinner';
import { TooltipComponent } from './tooltip';
import { VirtualKeyboard } from './virtual-keyboard';

export * from './buttons';
export * from './form-controls';
export * from './img-crop';
export * from './interactive-map';
export * from './material-styles';
export * from './modal';
export * from './notification';
export * from './page-controls';
export * from './spinner';
export * from './tooltip';
export * from './virtual-keyboard';

export let COMPONENTS: any[] = [
    Button,
    ButtonGroup,
    ButtonToggle,
    Calendar,
    DataInput,
    Dropdown,
    OldDropdown,
    Slider,
    TimePicker,
    Toggle,
    Typeahead,
    ImageCrop,
    ...MAP_COMPONENTS,
    MaterialStyles,
    NotifyBlock,
    TooltipComponent,
    ...TABS_COMPONENTS,
    ...STEPPER_COMPONENTS,
    Spinner
];

export let ENTRY_COMPONENTS: any[] = [
    Modal,
    ACA_WIDGET_MODALS,
    Notification,
    NotifyBlock,
    OldDropdownList,
    TypeaheadList,
    VirtualKeyboard
];
