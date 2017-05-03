/*
* @Author: Alex Sorafumo
* @Date:   2017-05-02 16:51:45
* @Last Modified by:   Alex Sorafumo
* @Last Modified time: 2017-05-03 10:12:42
*/

import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } from '@angular/core';

@Component({
    selector: 'media-player',
    templateUrl: './media-player.template.html',
    styleUrls: ['./media-player.styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('controls', [
            state('show', style({ 'bottom': '0' })),
            state('hide', style({ 'bottom': '-1.8em' })),
            transition('show <=> hide', animate('0.4s ease-out')),
        ]),
    ]
})
export class MediaPlayerComponent {
    @Input() src: any = null;
    @Input() color: string = '#2196F3'

    @Output() time: any = new EventEmitter();
    @Output() length: any = new EventEmitter();

    progress: number = 0;
    current_time: string = '00:00';
    duration: string = '00:00';
    start: number = (new Date()).getTime();
    media_playing: boolean = false;
    controls_active: boolean = true;
    hide_timer: any = null;
    is_end: boolean = false;

    @ViewChild('video') video: ElementRef;
    @ViewChild('player') player: ElementRef;

    constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {
    }

    ngAfterViewInit() {
        this.init();
    }

    init() {
        if(!this.player) {
            setTimeout(() => {
                this.init();
            }, 200);
        } else {
            this.playMedia();
        }
    }

    change() {
        this.zone.run(() => {
            this.cdr.markForCheck();
        });
    }

    changeMediaState() {
        if(this.media_playing) {
            this.stopMedia();
        } else {
            this.playMedia();
        }
    }

    playMedia() {
        this.media_playing = true;
        this.player.nativeElement.play();
        this.setDuration();
        setTimeout(() => {
            this.updateTimer();
        }, 400);
    }

    stopMedia() {
        this.media_playing = false;
        this.player.nativeElement.pause();
    }

    restartMedia() {
        this.player.nativeElement.play();
        this.player.nativeElement.currentTime = 0;
    }

    showTools() {
        this.controls_active = true;
        if(this.hide_timer) {
            clearTimeout(this.hide_timer);
        }
        this.hide_timer = setTimeout(() => {
            if(this.media_playing) {
                this.controls_active = false;
            }
            this.hide_timer = null;
        }, 3000);
    }

    updateTimer() {
        if(!this.player) return;
        let time = this.player.nativeElement.currentTime;
        let secs = Math.floor(time % 60);
        let mins = Math.floor(time/60);
        this.current_time = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
        this.time.emit(this.current_time);
        this.progress = this.player.nativeElement.currentTime / this.player.nativeElement.duration * 100;
        this.is_end = this.player.nativeElement.currentTime === this.player.nativeElement.duration;
        if(this.is_end) {
            this.stopMedia();
        }
        if(this.media_playing) {
            setTimeout(() => {
                this.updateTimer();
            }, 400);
        }
        this.change();
    }

    setDuration() {
        if(!this.player) return;
        let time = this.player.nativeElement.duration;
        let secs = Math.floor(time % 60);
        let mins = Math.floor(time/60);
        if(isNaN(secs) || isNaN(mins)) {
            setTimeout(() => {
                this.setDuration();
            }, 200);
            return;
        }
        this.duration = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
        this.length.emit(this.duration);
    }

    toggleFullScreen() {
        console.log('Toggle FullScreen')
        let doc: any = window.document;
        let docEl: any = this.video.nativeElement;

        let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        } else cancelFullScreen.call(doc);
    }
}
