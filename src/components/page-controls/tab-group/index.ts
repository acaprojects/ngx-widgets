/**
* @Author: Alex Sorafumo <Yuion>
* @Date:   13/09/2016 2:55 PM
* @Email:  alex@yuion.net
* @Filename: index.ts
* @Last modified by:   Yuion
* @Last modified time: 15/12/2016 11:32 AM
*/

export * from './tabs.component';

import { TabGroup } from './tabs.component';
import { TabHead } from './tab-head.component';
import { TabBody } from './tab-body.component';

export let TABS_COMPONENTS = [
    TabGroup, TabHead, TabBody
]
