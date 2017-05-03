/*
* @Author: Alex Sorafumo
* @Date:   2017-03-10 11:46:09
* @Last Modified by:   Alex Sorafumo
* @Last Modified time: 2017-05-03 11:56:46
*/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WIDGETS_SETTINGS } from '../settings';

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
    themes: any = {
        default: {

        }
    };
    private _obs: any = null;
    private observer: any = null;
    active_theme: string = 'default';
    listener_timer: any = null;

    constructor() {
        this._obs
    }

    newTheme(theme: string, components: any) {
        if(!this.themes[theme] && theme !== 'default') {
            this.themes[theme] = components;
            return true;
        }
        return false;
    }

    updateTheme(theme: string, components: any) {
        if(this.themes[theme] && theme !== 'default') {
            for(let i in components) {
                for(let el in components[i]) {
                    this.themes[theme][i][el] = components[i][el];
                }
            }
            if(theme === this.active_theme) {
                this.observer.next(this.themes[theme]);
            }
            return true;
        }
        return false;
    }

    addThemeComponents(theme: string, components: any) {
        if(this.themes[theme]) {
            for(let i in components) {
                if(!this.themes[theme][i]) {
                    this.themes[theme][i] = components[i];
                }
            }
        }
    }

    setTheme(theme: string) {
        if(this.themes[theme]) {
            this.active_theme = theme;
            this.observer.next(this.themes[this.active_theme]);
        }
    }

    get theme() {
        return this.active_theme;
    }

    listener() {
        if(this.listener_timer) {
            clearTimeout(this.listener_timer);
            this.listener_timer = null;
        }
        this.listener_timer = setTimeout(() => {
            this.observer.next(this.themes[this.active_theme]);
        }, 300);
        return this._obs;
    }
}
