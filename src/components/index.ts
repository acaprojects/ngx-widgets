/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   04/10/2016 11:53 AM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 07/02/2017 12:27 PM
 */

import { BUTTONS } from './buttons';
import { FORM_CONTROLS, TypeaheadList } from './form-controls';
import { ImageCrop } from './img-crop';
import { MAP_COMPONENTS } from './interactive-map';
import { MaterialStyles } from './material-styles';
import { MediaPlayerComponent } from './media-player';
import { PAGE_CONTROLS } from './page-controls';
import { ProgressCircleComponent } from './progress-circle';
import { Spinner } from './spinner';
import { VirtualKeyboard } from './virtual-keyboard';
import { OVERLAY_COMPONENTS } from './overlays';

export * from './buttons';
export * from './form-controls';
export * from './img-crop';
export * from './interactive-map';
export * from './material-styles';
export * from './media-player';
export * from './overlays';
export * from './page-controls';
export * from './spinner';
export * from './virtual-keyboard';

export let COMPONENTS: any[] = [
    ...BUTTONS,
    ...FORM_CONTROLS,
    ImageCrop,
    ...MAP_COMPONENTS,
    MaterialStyles,
    MediaPlayerComponent,
    ProgressCircleComponent,
    ...PAGE_CONTROLS,
    Spinner,
];

export let ENTRY_COMPONENTS: any[] = [
    ...OVERLAY_COMPONENTS,
    TypeaheadList,
    VirtualKeyboard,
];
