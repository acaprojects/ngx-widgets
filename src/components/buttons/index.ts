/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: index.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:27 AM
*/

import { Button } from './btn';
import { ButtonGroup } from './btn-group';
import { ButtonToggle } from './btn-toggle';

export * from './btn';
export * from './btn-group';
export * from './btn-toggle';

export const BUTTONS: any[] = [
    Button,
    ButtonGroup,
    ButtonToggle
];
