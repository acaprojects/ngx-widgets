/**
 * @Author: Alex Sorafumo
 * @Date:   04/10/2016 11:54 AM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 15/12/2016 11:37 AM
 */

import { Animate, NextFrame } from './animate.service';
import { DropService } from './drop-service';
import { DynamicTypeBuilder } from './dynamic/type.builder';
import { MapService } from './map.service';
import { OverlayService } from './overlay.service';

export * from './animate.service';
export * from './drop-service';
export * from './map.service';
export * from './overlay.service';
export * from './dynamic/type.builder';

// export let SERVICES: any[] = [
//     Animate,
//     NextFrame,
//     DropService,
//     MapService,
//     OverlayService,
//     DynamicTypeBuilder,
// ];
