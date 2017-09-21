/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   04/10/2016 11:54 AM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:33 AM
 */

import { DropTarget } from './drop-target.directive';
import { FileStream } from './file-stream.directive';
import { OVERLAY_DIRECTIVES } from './overlays';

export * from './drop-target.directive';
export * from './file-stream.directive';
export * from './overlays';

export let DIRECTIVES: any[] = [
    DropTarget,
    FileStream,
    ...OVERLAY_DIRECTIVES,
];
