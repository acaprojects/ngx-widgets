/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: spinner.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:32 AM
 */

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseWidgetComponent } from '../../../shared/base.component';

@Component({
    selector: 'spinner',
    styleUrls: [ './spinner.style.scss' ],
    templateUrl: './spinner.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent extends BaseWidgetComponent implements OnChanges {
    @Input() public type = 'plane';
    @Input() public color = '#000';

    public percent = 0;

    constructor(protected _cdr: ChangeDetectorRef) {
        super();
    }

    public ngOnInit() {
        // this.interval('percent', () => {
        //     this.percent += 1 / (1000 / 30);
        //     this.percent %= 1;
        //     this._cdr.markForCheck();
        // }, 20);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (this.type === null || this.type === undefined) {
            this.type = 'plane';
        }
    }

}
