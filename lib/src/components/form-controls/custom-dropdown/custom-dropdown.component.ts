
import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild, OnChanges } from '@angular/core';

@Component({
    selector: 'custom-dropdown',
    templateUrl: './custom-dropdown.template.html',
    styleUrls: ['./custom-dropdown.styles.scss'],
})
export class CustomDropdownComponent implements OnChanges {
    @Input() public name = '';
    @Input() public show = false;
    @Input() public content: TemplateRef<any>;
    @Input() public template: TemplateRef<any>;
    @Output() public modelChange: any = new EventEmitter();

    @ViewChild('ref') private reference: ElementRef;
    @ViewChild('body') private body: ElementRef;
    @ViewChild('active') private active: ElementRef;

    public font_size: 20;
    public width = 200;
    public bottom = false;

    public ngOnChanges(changes: any) {
        setTimeout(() => this.resize(), 300);
    }

    public updateSize(tries: number = 0) {
        if (tries > 10) { return; }
        if (this.body && this.body.nativeElement) {
            this.width = this.body.nativeElement.offsetWidth;
        } else {
            setTimeout(() => this.updateSize(++tries), 200);
        }
    }

    public resize() {
        this.updateSize();
        if (this.reference.nativeElement && this.reference.nativeElement) {
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
