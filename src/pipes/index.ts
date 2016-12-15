/**
* @Author: Alex Sorafumo
* @Date:   18/11/2016 4:31 PM
* @Email:  alex@yuion.net
* @Filename: index.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 15/12/2016 11:36 AM
*/

import { SafePipe } from './safe.pipe';
import { KeysPipe } from './keys.pipe';
import { SafeUrlPipe } from './safe-url.pipe';

export let PIPES: any[] = [
    SafePipe,
    KeysPipe,
    SafeUrlPipe
];
