/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: spinner.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:32 AM
 */

import { Component, Input, OnChanges } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'spinner',
    styleUrls: [ './spinner.style.scss' ],
    templateUrl: './spinner.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent implements OnChanges {
    @Input() public type = 'plane';
    @Input() public color = '#000';
    @Input() public name = 'default';

    public percent = 0;

    private timers: any = {};

    constructor(private _cdr: ChangeDetectorRef) { }

    public ngOnInit() {
        this.timers.percent = setInterval(() => {
            this.percent += 1 / (1000 / 30);
            this.percent %= 1;
            this._cdr.markForCheck();
        }, 20);
    }

    public ngOnChanges(changes: any) {
        if (this.type === null || this.type === undefined) {
            this.type = 'plane';
        }
    }

}
