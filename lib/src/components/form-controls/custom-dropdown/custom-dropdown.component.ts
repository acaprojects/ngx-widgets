
import { Component, Input, Output, OnChanges, OnInit } from '@angular/core';
import { ElementRef, EventEmitter, TemplateRef, ViewChild  } from '@angular/core';

import { BaseFormWidgetComponent } from '../../../shared/base-form.component';

@Component({
    selector: 'custom-dropdown',
    templateUrl: './custom-dropdown.template.html',
    styleUrls: ['./custom-dropdown.styles.scss'],
})
export class CustomDropdownComponent extends BaseFormWidgetComponent<number> implements OnInit, OnChanges {
    @Input() public content: TemplateRef<any>;
    @Input() public template: TemplateRef<any>;
    @Input() public show = false;
    @Output() public showChange: any = new EventEmitter<boolean>();

    @ViewChild('ref') private reference: ElementRef;
    @ViewChild('body') private body: ElementRef;
    @ViewChild('active') private active: ElementRef;

    public font_size: 20;
    public width = 200;
    public bottom = false;

    public ngOnInit() {
        this.timeout('resize', () => this.resize());
    }

    public ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
        this.timeout('resize', () => this.resize());
    }

    public updateSize(tries: number = 0) {
        if (tries > 5) { return; }
        if (this.body && this.body.nativeElement) {
            this.width = this.body.nativeElement.offsetWidth;
        } else {
            this.timeout('up_size', () => this.updateSize(tries), 200 * ++tries);
        }
    }

    public resize() {
        this.updateSize();
        if (this.reference && this.reference.nativeElement) {
            const box = this.reference.nativeElement.getBoundingClientRect();
            this.font_size = box.height;
        }
        if (this.active && this.active.nativeElement) {
            const box = this.active.nativeElement.getBoundingClientRect();
            const top = box.top + box.height / 2;
            const height = window.innerHeight || document.body.clientHeight;
            this.bottom = top > height / 2;
        }
    }

}
