/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   13/09/2016 2:55 PM
 * @Email:  alex@yuion.net
 * @Filename: btn-group.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:28 AM
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'btn-group',
    templateUrl: './btn-group.template.html',
    styleUrls: [ './btn-group.styles.css', '../../material-styles/material-styles.css'  ],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonGroup {
    @Input() public items: any;
    @Input() public model: number = 0;
    @Input() public color: string = 'blue';
    @Input() public primary: string = 'C500';
    @Input() public secondary: string = 'C600';
    @Input() public cssClass: string = '';
    @Output() public modelChange = new EventEmitter();

    public btn_class: string = '';
    public hover: boolean = false;

    public ngOnInit() {
        this.loadClasses();
    }

    public ngOnChanges(changes: any) {
        if (changes.color || changes.primary || changes.secondary) {
            this.loadClasses();
        }
    }

    public setHover(state: boolean) {
        this.hover = state;
        this.loadClasses();
    }

    public toggle(index: number) {
        this.model = index;
        this.modelChange.emit(this.model);
    }

    private loadClasses() {
        this.btn_class = '';
        if (this.cssClass === '') {
            if (!this.hover) {
                this.btn_class = `color bg-${this.color}-${this.primary} font-white`;
            } else {
                this.btn_class = `color bg-${this.color}-${this.secondary} font-white`;
            }
        }
    }
}
