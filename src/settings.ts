/*
* @Author: Alex Sorafumo
* @Date:   2017-03-08 11:23:08
* @Last Modified by:   Alex Sorafumo
* @Last Modified time: 2017-05-03 11:56:46
*/

import { Observable } from 'rxjs/Observable';

export class WIDGETS_SETTINGS {
    static var_list: string[] = ['debug'];
    static data: any = {};
    static obs: any = {};
    static _obs: any = {};

    static get(name: string) {
        return this.data[name];
    }

    static observe(var_name: string) {
        if(!WIDGETS_SETTINGS.obs[var_name]) {
            WIDGETS_SETTINGS.obs[var_name] = new Observable((observer) => {
                WIDGETS_SETTINGS._obs[var_name] = observer;
                setTimeout(() => {
                    WIDGETS_SETTINGS._obs[var_name].next(WIDGETS_SETTINGS.data[var_name]);
                }, 200);
            });
        }
        return WIDGETS_SETTINGS.obs[var_name];
    }

    static loadSettings() {
        let globalScope = self;
        if(globalScope) {
            for(let i of WIDGETS_SETTINGS.var_list) {
                if(globalScope[i] !== undefined && (WIDGETS_SETTINGS.data[i] === undefined || globalScope[i] !== WIDGETS_SETTINGS.data[i])) {
                    console.log(`[WIDGETS] [SETTINGS] ${i} was changed from ${WIDGETS_SETTINGS.data[i]} to ${globalScope[i]}`)
                    WIDGETS_SETTINGS.data[i] = globalScope[i];
                    if(!WIDGETS_SETTINGS.obs[i] || !WIDGETS_SETTINGS._obs[i]) {
                        WIDGETS_SETTINGS.obs[i] = new Observable((observer) => {
                            WIDGETS_SETTINGS._obs[i] = observer;
                            WIDGETS_SETTINGS._obs[i].next(WIDGETS_SETTINGS.data[i]);
                        });
                    } else if(WIDGETS_SETTINGS._obs[i]){
                        WIDGETS_SETTINGS._obs[i].next(WIDGETS_SETTINGS.data[i]);
                    }

                }
            }
                // Load data for mock control systems
            if(globalScope['systemData']) {
                WIDGETS_SETTINGS.data['control'] = globalScope['systemData'];
            } else if(globalScope['systemsData']) {
                WIDGETS_SETTINGS.data['control'] = globalScope['systemsData'];
            } else if(globalScope['control'] && globalScope['control']['systems']) {
                WIDGETS_SETTINGS.data['control'] = globalScope['control']['systems'];
            }
        }
    }
}

setTimeout(() => {
    WIDGETS_SETTINGS.loadSettings();
    setInterval(() => {
        WIDGETS_SETTINGS.loadSettings();
    }, 500);
}, 100);

