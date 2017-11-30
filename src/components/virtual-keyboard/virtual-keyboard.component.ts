/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   28/10/2016 11:24 AM
 * @Email:  alex@yuion.net
 * @Filename: virtual-keyboard.component.ts
 * @Last modified by:   Yuion
 * @Last modified time: 15/12/2016 11:32 AM
 */

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const KEY_LIST = {
    QWERTY : {
        normal: [
            '`1234567890-=',
            'qwertyuiop[]\\',
            'asdfghjkl;\'',
            'zxcvbnm,./',
        ],
        shift: [
            '~!@#$%^&*()_+',
            'QWERTYUIOP{}',
            'ASDFGHJKL:"',
            'ZXCVBNM<>?',
        ],
    },
    NUMPAD : {
        normal: [
            '123', '456', '789', '*0#',
        ],
        shift: [
            '123', '456', '789', '*0#',
        ],
    },
};

@Component({
  selector: 'keyboard-display',
  styleUrls: [ './virtual-keyboard.style.css' ],
  templateUrl: './virtual-keyboard.template.html',
  animations: [
      trigger('keyboard', [
          state('hide', style({ opacity : '0', transform: 'scale(0.5)', display: 'none' })),
          state('show', style({ opacity : '1', transform: 'scale(1.0)' })),
          transition('show <=> hide', animate('0.25s ease-out')),
          transition('void => show', animate('0.25s ease-in')),
      ]),
      trigger('keyboardleft', [
          state('hide', style({ opacity : '0', left: '-100%' })),
          state('show', style({ opacity : '1', left: '0' })),
          transition('show <=> hide', animate('0.25s ease-out')),
          transition('void => show', animate('0.25s ease-in')),
      ]),
      trigger('keyboardright', [
          state('hide', style({ opacity : '0', right: '-100%' })),
          state('show', style({ opacity : '1', right: '0' })),
          transition('show <=> hide', animate('0.25s ease-out')),
          transition('void => show', animate('0.25s ease-in')),
      ]),
  ],
})
export class VirtualKeyboard {
    @Input() public model: string = '';
    @Input() public active: boolean = false;
    @Input() public type: string = 'QWERTY';
    @Input() public layout: string = 'standard';
    @Output() public modelChange = new EventEmitter();
    @Output() public activeChange = new EventEmitter();

    public top: string = '';
    public left: string = '';
    public top_value: number = 0;
    public left_value: number = 0;
    public keys: any = { normal: [], shift: [] };
    public is_shift: boolean = false;
    public is_caps: boolean = false;

    @ViewChild('main') private keyboard: ElementRef;

    constructor() {
        this.loadKeys();
    }

    public ngOnChanges(changes: any) {
        if (changes.type) {
            this.loadKeys();
        }
        if (changes.layout) {
            this.loadLayout();
        }
    }

    public open() {
        setTimeout(() => {
            this.active = true;
        }, 20);
    }

    public close() {
        setTimeout(() => {
            this.active = false; this.activeChange.emit(false);
        }, 20);
    }

    public addChar(char: string) {
        setTimeout(() => {
            this.model += char;
            this.is_shift = false;
            this.modelChange.emit(this.model);
        }, 20);
    }

    public backspace() {
        setTimeout(() => {
            this.model = this.model.substring(0, this.model.length - 1);
            this.modelChange.emit(this.model);
        }, 20);
    }

    public delete() {
        return;
    }

    public clear() {
        setTimeout(() => {
            this.model = '';
            this.modelChange.emit(this.model);
        }, 20);
    }

    public caps() {
        this.is_caps = !this.is_caps;
    }

    public shift() {
        this.is_shift = !this.is_shift;
    }

    public moveKeyboard(e: any) {
        if (e) {
            if (this.keyboard) {
                const key_box = this.keyboard.nativeElement.getBoundingClientRect();
                if (this.top === '' || this.left === '') {
                    this.top_value = key_box.top;
                    this.left_value = key_box.left;
                } else {
                    this.top_value = e.center.y - 25;
                    this.left_value = e.center.x;
                }
                if (this.top_value < 0) {
                    this.top_value = 0;
                }
                if (this.left_value < key_box.width / 2) {
                    this.left_value = key_box.width / 2;
                }
                this.top = this.top_value + 'px';
                this.left = this.left_value + 'px';
            }
        }
    }

    private loadLayout() {
        setTimeout(() => {
            this.loadKeys();
            if (this.layout === 'split') {
                const keys: any = { left: {}, right: {} };
                const left: any = { normal: [], shift: [] };
                const right: any = { normal: [], shift: [] };

                let n_len = Math.ceil(this.keys.normal[0].length / 2);
                let s_len = Math.ceil(this.keys.shift[0].length / 2);

                left.normal.push(this.keys.normal[0].slice(0, n_len));
                left.shift.push(this.keys.shift[0].slice(0, s_len));
                right.normal.push(this.keys.normal[0].slice(n_len, this.keys.normal[0].length));
                right.shift.push(this.keys.shift[0].slice(s_len, this.keys.shift[0].length));
                for (let i = 1; i < this.keys.normal.length; i++) {
                    n_len = Math.floor(this.keys.normal[i].length / 2);
                    s_len = Math.floor(this.keys.shift[i].length / 2);

                    left.normal.push(this.keys.normal[i].slice(0, n_len));
                    left.shift.push(this.keys.shift[i].slice(0, s_len));
                    right.normal.push(this.keys.normal[i].slice(n_len, this.keys.normal[i].length));
                    right.shift.push(this.keys.shift[i].slice(s_len, this.keys.shift[i].length));
                }
                keys.left = left;
                keys.right = right;
                this.keys = keys;
            }
        }, 50);
    }

    private loadKeys() {
        this.keys = KEY_LIST[this.type.toUpperCase()];
        if (!this.keys) {
            this.keys = KEY_LIST.QWERTY;
        }
        for (let i = 0; i < this.keys.normal.length; i++) {
            if (typeof this.keys.normal[i] === 'string') {
                this.keys.normal[i] = this.keys.normal[i].split('');
            }
            if (typeof this.keys.shift[i] === 'string') {
                this.keys.shift[i] = this.keys.shift[i].split('');
            }
        }
    }
}
