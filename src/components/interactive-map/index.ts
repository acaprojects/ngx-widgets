/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: index.ts
 * @Last modified by:   alex.sorafumo
 * @Last modified time: 09/01/2017 3:27 PM
 */
import { InteractiveMap } from './map.component';
import { MapMarkerComponent, MapMarkerGroupComponent } from './markers';

export * from './map.component';
export * from './markers';

export const MAP_COMPONENTS = [
    InteractiveMap,
    MapMarkerGroupComponent,
    MapMarkerComponent,
];
