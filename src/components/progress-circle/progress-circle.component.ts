/*
 * @Author: Alex Sorafumo
 * @Date:   2017-03-29 09:24:29
 * @Last Modified by:   Alex Sorafumo
 * @Last Modified time: 2017-05-05 10:46:34
 */

import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
    selector: 'progress-circle',
    templateUrl: './progress-circle.template.html',
    styleUrls: ['./progress-circle.styles.css'],
})
export class ProgressCircleComponent {
    @Input() public progress: number = 0; // Number between 0 and 1000
    @Input() public bg: string = '#CFD8DC';
    @Input() public color: string = '#2196F3';
    @Input() public innerColor: string = '#2196F3';

    @ViewChild('main') private main: ElementRef;
    @ViewChild('maskfull') private mask_full: ElementRef;
    @ViewChild('full') private full: ElementRef;
    @ViewChild('half') private half: ElementRef;
    @ViewChild('fix') private fix: ElementRef;
    @ViewChild('inner') private inner: ElementRef;

    constructor(private renderer: Renderer2) {

    }

    public ngOnChanges(changes: any) {
        if (changes.progress) {
            this.update();
        }

        if (changes.color || changes.innerColor) {
            this.changeColor();
        }
    }

    public update() {
        this.progress = Math.round(this.progress);
        if (this.progress < 0) {
            this.progress = 0;
        } else if (this.progress > 1000) {
            this.progress = 1000;
        }
        if (this.main) {
            this.renderer.setAttribute(this.main.nativeElement, 'data-progress', this.progress.toString());
        }
        if (this.full) {
            this.renderer.setStyle(this.full.nativeElement, 'transform', `rotate(${180 / 1000 * this.progress}deg)`);
        }
        if (this.mask_full) {
            const rotate = `rotate(${180 + 180 / 1000 * this.progress}deg)`;
            this.renderer.setStyle(this.mask_full.nativeElement, 'transform', rotate);
        }
        if (this.fix) {
            this.renderer.setStyle(this.fix.nativeElement, 'transform', `rotate(${180 / 1000 * this.progress * 2}deg)`);
        }
    }

    public changeColor() {
        if (this.full && this.fix && this.half && this.inner && this.main && this.mask_full) {
            this.renderer.setStyle(this.full.nativeElement, 'background-color', this.color);
            this.renderer.setStyle(this.half.nativeElement, 'background-color', this.color);
            this.renderer.setStyle(this.fix.nativeElement, 'background-color', this.color);
            this.renderer.setStyle(this.inner.nativeElement, 'background-color', this.innerColor);
            this.renderer.setStyle(this.main.nativeElement, 'background-color', this.bg);
            this.renderer.setStyle(this.mask_full.nativeElement, 'background-color', this.bg);
        } else {
            setTimeout(() => {
                this.changeColor();
            }, 200);
        }
    }
}
