/*
 * @Author: Alex Sorafumo
 * @Date:   2017-03-08 11:23:08
 * @Last Modified by: Alex Sorafumo
 * @Last Modified time: 2018-06-14 20:22:55
 */

import { Observable } from 'rxjs';

export class WIDGETS {

    private static var_list: string[] = ['debug'];
    private static data: any = {};
    private static obs: any = {};
    private static _obs: any = {};
    private static timer: any = null;
    private static load_count = 0;
    public static app_version = '0.16.0';

    public static init() {
        setTimeout(() => {
            WIDGETS.loadSettings();
            WIDGETS.timer = setInterval(() => {
                WIDGETS.load_count++;
                WIDGETS.loadSettings();
                if (WIDGETS.load_count > 10) {
                    clearInterval(WIDGETS.timer);
                    WIDGETS.timer = null;
                }
            }, 1000);
        }, 50);
    }
    /*
    public static state(name: string) {
        return this.data[name];
    }
    */
    public static observe(var_name: string) {
        if (!WIDGETS.obs[var_name]) {
            WIDGETS.obs[var_name] = new Observable((observer) => {
                WIDGETS._obs[var_name] = observer;
                setTimeout(() => {
                    WIDGETS._obs[var_name].next(WIDGETS.data[var_name]);
                }, 200);
            });
        }
        return WIDGETS.obs[var_name];
    }

    public static loadSettings() {
        const globalScope = self as any;
        if (globalScope) {
            for (const i of WIDGETS.var_list) {
                if (globalScope[i] !== undefined && (WIDGETS.data[i] === undefined
                    || globalScope[i] !== WIDGETS.data[i])) {

                    WIDGETS.data[i] = globalScope[i];
                    if (!WIDGETS.obs[i] || !WIDGETS._obs[i]) {
                        WIDGETS.obs[i] = new Observable((observer) => {
                            WIDGETS._obs[i] = observer;
                            WIDGETS._obs[i].next(WIDGETS.data[i]);
                        });
                    } else if (WIDGETS._obs[i]) {
                        WIDGETS._obs[i].next(WIDGETS.data[i]);
                    }

                }
            }
        }
    }

    public static log(type: string, msg: string, args?: any, out: string = 'debug', color?: string) {
        if (WIDGETS.data && WIDGETS.data.debug) {
            const clr = color ? color : '#009688';
            const COLOURS = ['color: #673ab7', `color:${clr}`, 'color:rgba(0,0,0,0.87)'];
            if (args) {
                if (WIDGETS.hasColours()) {
                    console[out](`%c[WIDGETS]%c[${type}] %c${msg}`, ...COLOURS, args);
                } else {
                    console[out](`[WIDGETS][${type}] ${msg}`, args);
                }
            } else {
                if (WIDGETS.hasColours()) {
                    console[out](`%c[WIDGETS]%c[${type}] %c${msg}`, ...COLOURS);
                } else {
                    console[out](`[WIDGETS][${type}] ${msg}`);
                }
            }
        }
    }

    public static error(type: string, msg: string, args?: any) {
        WIDGETS.log(type, msg, args, 'error');
    }

    public static version(build: string, out: any = 'debug') {
        const COLOURS = ['color: #f44336', 'color:#9c27b0', 'color:rgba(0,0,0,0.87)'];
        if (WIDGETS.hasColours()) {
            console[out](`%c[ACA]%c[LIB] %cWidgets - ${WIDGETS.app_version} | ${build}`, ...COLOURS);
        } else {
            console[out](`[ACA][LIB] Widgets - ${WIDGETS.app_version} | ${build}`);
        }
    }

    private static hasColours() {
        const doc = document as any;
        return !(doc.documentMode || /Edge/.test(navigator.userAgent));
    }
}

WIDGETS.init();
