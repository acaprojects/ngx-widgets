/*
 * @Author: Alex Sorafumo
 * @Date:   2017-03-10 11:46:09
 * @Last Modified by:   Alex Sorafumo
 * @Last Modified time: 2017-05-05 10:32:35
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WIDGETS } from '../settings';

/*
Theme Data Structure

'default' : { // Name of theme
    'ButtonComponent' : { // Name of Component
        'ButtonElement' : { // Name of element
            'box-shadow' : '0 0.1em 0.2em 0.1em rgba(0,0,0,0.2)' // Style to apply to element
        }
    }
}
 */

@Injectable()
export class WidgetThemeService {
    private themes: any = {
        default: {

        },
    };
    private _obs: any = null;
    private observer: any = null;
    private active_theme: string = 'default';
    private listener_timer: any = null;

    constructor() {
        // this._obs;
    }

    public newTheme(theme: string, components: any) {
        if (!this.themes[theme] && theme !== 'default') {
            this.themes[theme] = components;
            return true;
        }
        return false;
    }

    public updateTheme(theme: string, components: any) {
        if (this.themes[theme] && theme !== 'default') {
            for (const i in components) {
                if (components[i]) {
                    for (const el in components[i]) {
                        if (components[i][el]) {
                            this.themes[theme][i][el] = components[i][el];
                        }
                    }
                }
            }
            if (theme === this.active_theme) {
                this.observer.next(this.themes[theme]);
            }
            return true;
        }
        return false;
    }

    public addThemeComponents(theme: string, components: any) {
        if (this.themes[theme]) {
            for (const i in components) {
                if (!this.themes[theme][i] && components[i]) {
                    this.themes[theme][i] = components[i];
                }
            }
        }
    }

    public setTheme(theme: string) {
        if (this.themes[theme]) {
            this.active_theme = theme;
            this.observer.next(this.themes[this.active_theme]);
        }
    }

    get theme() {
        return this.active_theme;
    }

    public listener() {
        if (this.listener_timer) {
            clearTimeout(this.listener_timer);
            this.listener_timer = null;
        }
        this.listener_timer = setTimeout(() => {
            this.observer.next(this.themes[this.active_theme]);
        }, 300);
        return this._obs;
    }
}
