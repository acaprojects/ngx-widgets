/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: tab-head.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:32 AM
 */

import { Component, Input, TemplateRef} from '@angular/core';

@Component({
    selector: 'tab-head',
    template: `<div class="tab" [class.active]="active" (click)="setActive()"><ng-content></ng-content></div>`,
    styleUrls: ['./tab-head.styles.scss'],
})
export class TabHeadComponent {
    @Input() public id: string;
    @Input() public name: string;
    @Input() public active: boolean;
    @Input() public template: TemplateRef<any>;

    public parent: any = null;

    public setActive() {
        if (this.parent) {
            this.parent.active = this.id;
        }
    }
}
