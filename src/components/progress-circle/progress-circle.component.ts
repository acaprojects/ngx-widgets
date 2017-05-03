/*
* @Author: Alex Sorafumo
* @Date:   2017-03-29 09:24:29
* @Last Modified by:   Alex Sorafumo
* @Last Modified time: 2017-05-03 11:56:45
*/

import { Component, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';


@Component({
    selector: 'progress-circle',
    templateUrl: './progress-circle.template.html',
    styleUrls: ['./progress-circle.styles.css']
})
export class ProgressCircleComponent {
    @Input() progress: number = 0; // Number between 0 and 1000
    @Input() bg: string = '#CFD8DC';
    @Input() color: string = '#2196F3';
    @Input() innerColor: string = '#2196F3';

    @ViewChild('main') main: ElementRef;
    @ViewChild('maskfull') mask_full: ElementRef;
    @ViewChild('full') full: ElementRef;
    @ViewChild('half') half: ElementRef;
    @ViewChild('fix') fix: ElementRef;
    @ViewChild('inner') inner: ElementRef;

    constructor(private renderer: Renderer2) {

    }

    ngAfterViewInit() {

    }

    ngOnChanges(changes: any) {
        if(changes.progress) {
            this.update();
        }

        if(changes.color || changes.innerColor) {
            this.changeColor();
        }
    }

    update() {
        this.progress = Math.round(this.progress);
        if(this.progress < 0) this.progress = 0;
        else if(this.progress > 1000) this.progress = 1000;
        if(this.main) {
            this.renderer.setAttribute(this.main.nativeElement, 'data-progress', this.progress.toString());
        }
        if(this.full) {
            this.renderer.setStyle(this.full.nativeElement, 'transform', `rotate(${180/1000 * this.progress}deg)`);
        }
        if(this.mask_full) {
            this.renderer.setStyle(this.mask_full.nativeElement, 'transform', `rotate(${180 + 180/1000 * this.progress}deg)`);
        }
        ///*
        //*/
        if(this.fix) {
            this.renderer.setStyle(this.fix.nativeElement, 'transform', `rotate(${180/1000 * this.progress * 2}deg)`);
        }
    }

    changeColor() {
        if(this.full && this.fix && this.half && this.inner && this.main && this.mask_full) {
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
