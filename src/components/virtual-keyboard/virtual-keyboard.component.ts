import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, animate, style, state, keyframes } 	 from '@angular/core';
import { Observable } from 'rxjs/Rx';

const KEY_LIST = {
    QWERTY : {
        normal: [
            '`1234567890-=',
            'qwertyuiop[]\\',
            'asdfghjkl;\'',
            'zxcvbnm,./'
        ],
        shift: [
            '~!@#$%^&*()_+',
            'QWERTYUIOP{}',
            'ASDFGHJKL:"',
            'ZXCVBNM<>?'
        ]
    },
    NUMPAD : {
        normal: [
            '123', '456', '789', '*0#'
        ],
        shift: [
            '123', '456', '789', '*0#'
        ]
    }
}

@Component({
  selector: 'keyboard-display',
  styleUrls: [ './virtual-keyboard.style.css' ],
  templateUrl: './virtual-keyboard.template.html',
  animations: [
      trigger('keyboard', [
          state('hide', style({ opacity : '0', transform: 'scale(0.5)', display: 'none' })),
          state('show', style({ opacity : '1', transform: 'scale(1.0)' })),
          transition('show <=> hide', animate('0.25s ease-out')),
          transition('void => show', animate('0.25s ease-in'))
      ]),
      trigger('keyboardleft', [
          state('hide', style({ opacity : '0', left: '-100%' })),
          state('show', style({ opacity : '1', left: '0' })),
          transition('show <=> hide', animate('0.25s ease-out')),
          transition('void => show', animate('0.25s ease-in'))
      ]),
      trigger('keyboardright', [
          state('hide', style({ opacity : '0', right: '-100%' })),
          state('show', style({ opacity : '1', right: '0' })),
          transition('show <=> hide', animate('0.25s ease-out')),
          transition('void => show', animate('0.25s ease-in'))
      ])
  ]
})
export class VirtualKeyboard {
    @Input() model: string = '';
    @Input() active: boolean = false;
    @Input() type: string = 'QWERTY';
    @Input() layout: string = 'standard';
    @Output() modelChange = new EventEmitter();
    @Output() activeChange = new EventEmitter();

    @ViewChild('main') keyboard: ElementRef;

    top: string = '';
    left: string = '';
    top_value: number = 0;
    left_value: number = 0;
    keys: any = { normal: [], shift: [] };
    is_shift: boolean = false;
    is_caps: boolean = false;

    constructor() {
        this.loadKeys();
    }

    ngOnInit() {

    }

    ngOnChanges(changes: any) {
        if(changes.type) {
            this.loadKeys();
        }
        if(changes.layout) {
            this.loadLayout();
        }
    }

    open() {
        console.log('Open Virtual Keyboard');
        setTimeout(() => { this.active = true; }, 20);
    }

    close() {
        console.log('Close Virtual Keyboard');
        setTimeout(() => { this.active = false; this.activeChange.emit(false); }, 20);
    }

    loadLayout() {
        setTimeout(() => {
            this.loadKeys();
            if(this.layout === 'split') {
                let keys: any = { left: {}, right: {} };
                let left: any = { normal: [], shift: [] };
                let right: any = { normal: [], shift: [] };
                left.normal.push(this.keys.normal[0].slice(0, Math.ceil(this.keys.normal[0].length/2)));
                left.shift.push(this.keys.shift[0].slice(0, Math.ceil(this.keys.shift[0].length/2)));
                right.normal.push(this.keys.normal[0].slice(Math.ceil(this.keys.normal[0].length/2), this.keys.normal[0].length));
                right.shift.push(this.keys.shift[0].slice(Math.ceil(this.keys.shift[0].length/2), this.keys.shift[0].length));
                for(let i = 1; i < this.keys.normal.length; i++) {
                    left.normal.push(this.keys.normal[i].slice(0, Math.floor(this.keys.normal[i].length/2)));
                    left.shift.push(this.keys.shift[i].slice(0, Math.floor(this.keys.shift[i].length/2)));
                    right.normal.push(this.keys.normal[i].slice(Math.floor(this.keys.normal[i].length/2), this.keys.normal[i].length));
                    right.shift.push(this.keys.shift[i].slice(Math.floor(this.keys.shift[i].length/2), this.keys.shift[i].length));
                }
                keys.left = left;
                keys.right = right;
                this.keys = keys;
            }
        }, 50);
    }

    loadKeys() {
        this.keys = KEY_LIST[this.type.toUpperCase()];
        if(!this.keys) this.keys = KEY_LIST['QWERTY'];
        for(let i = 0; i < this.keys.normal.length; i++) {
            if(typeof this.keys.normal[i] === 'string') this.keys.normal[i] = this.keys.normal[i].split('');
            if(typeof this.keys.shift[i] === 'string') this.keys.shift[i] = this.keys.shift[i].split('');
        }
    }

    addChar(char: string) {
        setTimeout(() => {
            this.model += char;
            this.is_shift = false;
            this.modelChange.emit(this.model);
        }, 20);
    }

    backspace() {
        setTimeout(() => {
            this.model = this.model.substring(0, this.model.length - 1);
            this.modelChange.emit(this.model);
        }, 20);
    }

    delete() {

    }

    clear() {
        setTimeout(() => {
            this.model = '';
            this.modelChange.emit(this.model);
        }, 20);
    }

    caps() {
        this.is_caps = !this.is_caps;
    }

    shift() {
        this.is_shift = !this.is_shift;
    }

    moveKeyboard(e: any) {
        if(e) {
            if(this.keyboard){
                let key_box = this.keyboard.nativeElement.getBoundingClientRect();
                if(this.top === '' || this.left === '') {
                    this.top_value = key_box.top;
                    this.left_value = key_box.left;
                } else {
                    this.top_value = e.center.y - 25;
                    this.left_value = e.center.x;
                }
                if(this.top_value < 0) this.top_value = 0;
                if(this.left_value < key_box.width/2) this.left_value = key_box.width/2;
                this.top = this.top_value + 'px';
                this.left = this.left_value + 'px';
            }
        }
    }
}
