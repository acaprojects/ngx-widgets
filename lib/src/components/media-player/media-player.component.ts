/*
 * @Author: Alex Sorafumo
 * @Date:   2017-05-02 16:51:45
 * @Last Modified by:   Alex Sorafumo
 * @Last Modified time: 2017-05-05 11:07:01
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'media-player',
    templateUrl: './media-player.template.html',
    styleUrls: ['./media-player.styles.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('controls', [
            state('show', style({ bottom: '0' })),
            state('hide', style({ bottom: '-1.8em' })),
            transition('show <=> hide', animate('0.4s ease-out')),
        ]),
    ],
})
export class MediaPlayerComponent {
    @Input() public src: any = null;
    @Input() public color = '#2196F3';
    @Input() public autoplay = false;

    @Output() public time: any = new EventEmitter();
    @Output() public length: any = new EventEmitter();

    public progress = 0;
    public current_time = '00:00';
    public duration = '00:00';
    public start: number = (new Date()).getTime();
    public media_playing = false;
    public controls_active = true;
    public is_end = false;

    private hide_timer: any = null;

    @ViewChild('video') private video: ElementRef;
    @ViewChild('player') private player: ElementRef;

    constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {

    }

    public ngAfterViewInit() {
        this.init();
    }

    public change() {
        this.zone.run(() => this.cdr.markForCheck());
    }

    public changeMediaState() {
        if (this.media_playing) {
            this.stopMedia();
        } else {
            this.playMedia();
        }
    }

    public playMedia() {
        this.media_playing = true;
        this.player.nativeElement.play();
        this.setDuration();
        setTimeout(() => this.updateTimer(), 400);
    }

    public stopMedia() {
        this.media_playing = false;
        this.player.nativeElement.pause();
    }

    public restartMedia() {
        this.player.nativeElement.play();
        this.player.nativeElement.currentTime = 0;
    }

    public showTools() {
        this.controls_active = true;
        if (this.hide_timer) {
            clearTimeout(this.hide_timer);
        }
        this.hide_timer = setTimeout(() => {
            if (this.media_playing) {
                this.controls_active = false;
            }
            this.hide_timer = null;
        }, 3000);
    }

    public updateTimer() {
        if (!this.player) {
            return;
        }
        const time = this.player.nativeElement.currentTime;
        const secs = Math.floor(time % 60);
        const mins = Math.floor(time / 60);
        this.current_time = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
        this.time.emit(this.current_time);
        this.progress = this.player.nativeElement.currentTime / this.player.nativeElement.duration * 100;
        this.is_end = this.player.nativeElement.currentTime === this.player.nativeElement.duration;
        if (this.is_end) {
            this.stopMedia();
        }
        if (this.media_playing) {
            setTimeout(() => this.updateTimer(), 400);
        }
        this.change();
    }

    public setDuration() {
        if (!this.player) {
            return;
        }
        const time = this.player.nativeElement.duration;
        const secs = Math.floor(time % 60);
        const mins = Math.floor(time / 60);
        if (isNaN(secs) || isNaN(mins)) {
            return setTimeout(() => this.setDuration(), 200);
        }
        this.duration = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
        this.length.emit(this.duration);
    }

    public toggleFullScreen() {
        const doc: any = window.document;
        const docEl: any = this.video.nativeElement;

        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen
            || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen
            || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement
            && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {

            requestFullScreen.call(docEl);
        } else {
            cancelFullScreen.call(doc);
        }
    }

    private init() {
        if (!this.player) {
            setTimeout(() => this.init(), 200);
        } else {
            if (this.autoplay) {
                this.playMedia();
            } else {
                this.stopMedia();
            }
        }
    }
}
