/*
 * @Author: Alex Sorafumo
 * @Date:   2017-03-08 11:23:08
 * @Last Modified by:   Alex Sorafumo
 * @Last Modified time: 2017-05-03 12:38:35
 */

import { Observable } from 'rxjs/Observable';

export class WIDGETS {

    public static get(name: string) {
        return this.data[name];
    }

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

    public static log(type: string, msg: string, args?: any, out: string = 'debug') {
        if (WIDGETS.data && WIDGETS.data.debug) {
            if (args) {
                console[out](`[COMPOSER][${type}] ${msg}`, args);
            } else {
                console[out](`[COMPOSER][${type}] ${msg}`);
            }
        }
    }

    public static error(type: string, msg: string, args?: any) {
        WIDGETS.log(type, msg, args, 'error');
    }

    public static version(version: string, build: string, out: any = 'debug') {
        console[out](`[ACA][LIBRARY] Widgets - Version: ${version} | Build: ${build}`);
    }

    private static var_list: string[] = ['debug'];
    private static data: any = {};
    private static obs: any = {};
    private static _obs: any = {};
}

setTimeout(() => {
    WIDGETS.loadSettings();
    setInterval(() => {
        WIDGETS.loadSettings();
    }, 500);
}, 100);
