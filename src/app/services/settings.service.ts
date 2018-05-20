/**
 * @Author: Alex Sorafumo <Yuion>
 * @Date:   09/12/2016 3:33 PM
 * @Email:  alex@yuion.net
 * @Filename: settings.service.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 03/02/2017 9:52 AM
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Observable ,  BehaviorSubject } from 'rxjs';
import { Utils } from '../shared/utility.class';

const APP_NAME = 'ACA_APP';
const RESERVED_KEYS = ['route', 'query', 'store'];
const OBSERVABLES: any[] = [
    { name: 'loading', default: false },
    { name: 'loading_text', default: 'Loading' },
];

@Injectable()
export class SettingsService {
    public parent: any = null;
    public setup = false;
    private store: Storage = localStorage;
    private model: any = {
        loading: {
            prefix: 'Loading',
            text: ['', '.', '..', '...'],
            state: 0,
        },
        app: { name: '' },
        subjects: {},
        observers: {},
        settings: {},
    };
    private timers: any = {};
    private settings_promise: Promise<any> = null;

    constructor(private http: HttpClient, private route: ActivatedRoute) {
        this.model.app.name = APP_NAME;
        for (const n of OBSERVABLES) {
            this.model.subjects[n.name] = new BehaviorSubject(n.default);
            this.model.observers[n.name] = this.model.subjects[n.name].asObservable();
        }
        this.loadStore();
        this.init();
    }

    public init() {
        window.scrollTo(0, 1);
        // Load settings file
        this.log('SYSTEM', 'Initialising Settings');
        this.loadSettings().then((s: any) => {
            const win = window as any;
            if (s.app && s.app.code) {
                this.model.app.name = s.app.code;
            }
            if (s.debug) {
                win.debug = true;
                if (!win.debug_module) {
                    win.debug_module = [];
                }
                if (s.debug_module) {
                    win.debug_module = (win.debug_module || []).concat(s.debug_module);
                }
                if (win.debug_module.indexOf(this.model.app.name) < 0) {
                    win.debug_module.push(this.model.app.name);
                }
            }
            if (s.version) { this.log('SYSTEM', `Version: ${s.version}`); }
            if (s.build) { this.log('SYSTEM', `Build: ${s.build}`); }
            this.setup = true;
        }, (err: any) => {
            setTimeout(() => {
                this.init();
            }, 500);
        });
    }
    /**
     * Prints message to the console
     * @param type [description]
     * @param msg    Message to print to the console
     * @param stream IO Stream to print message to.
     */
    public log(type: string, msg: string, args?: any, stream: string = 'debug') {
        const win = window as any;
        if (win.debug) {
            const colors: string[] = ['color: #E91E63', 'color: #3F51B5', 'color: rgba(0,0,0,0.87'];
            if (args) {
                console[stream](`%c[${this.model.app.name}]%c[${type}] %c${msg}`, ...colors, args);
            } else {
                console[stream](`%c[${this.model.app.name}]%c[${type}] %c${msg}`, ...colors);
            }
        }
    }

    /**
     * Loads settings from a given JSON file
     * @param  {string = 'assets/settings.json'} file Name of a JSON file to load settings from
     * @return {Promise<Object>}      Returns a promise which returns the settings loaded from the given file
     */
    public loadSettings(file: string = 'assets/settings.json') {
        if (!this.settings_promise) {
            this.settings_promise = new Promise((resolve, reject) => {
                this.http.get(file)
                    .subscribe(
                    (data) => {
                        for (const i in data) {
                            if (data[i]) {
                                this.model.settings[i] = data[i];
                            }
                        }
                        const win = window as any;
                        if (win.debug && win.debug_module.includes(this.model.app.name)) {
                            this.log('Settings', `Loaded settings for application`);
                        }
                    }, (err) => { reject(err); },
                    () => {
                        resolve(this.model.settings);
                });
            });
        }
        return this.settings_promise;
    }

    /**
     * Saves the given value in local storage and add it to the settings.
     * @param key   Reference to store the item as
     * @param value Value to store in the give key
     * @return none
     */
    public save(key: string, value: string) {
        if (this.store && RESERVED_KEYS.indexOf(key) < 0) {
            this.store.setItem(`APP.${key}`, value);
            this.model.settings[key] = value;
            if (!this.model.settings.store) {
                this.model.settings.store = {};
            }
            this.model.settings.store[key] = value;
        }
    }
    /**
     * Gets the setting value for the give key
     * @param key Name of the setting to get
     * @return {any}     Returns the value stored in the settings or null
     */
    public get(key: string) {
        const keys = key.split('.');
        if (keys.length === 1) {
            return this.model.settings[key];
        } else {
            const use_keys = keys.splice(1, keys.length - 1);
            let item = this.getItemFromKeys(use_keys, this.model.settings[keys[0]]);
            // Check that item exists under the reserved keys
            if (!item && item !== 0) {
                for (const r of RESERVED_KEYS) {
                    if (this.model.settings.hasOwnProperty(r) && this.model.settings[r]) {
                        item = this.getItemFromKeys(use_keys, this.model.settings[r]);
                        if (!item && item !== 0) {
                            break;
                        }
                    }
                }
            }
            return item;
        }
    }
    /**
     * Gets nested setting value
     * @param  {string[]} keys List of keys to iterate down the object
     * @param root Root element of the search
     * @return {any}        Returns the value a the end of the iteration or null
     */
    public getItemFromKeys(keys: string[], root: any) {
        if (keys.length <= 0) {
            return root;
        }
        if (typeof root !== 'object') {
            return null;
        }
        let item = root;
        // Iterate through keys to traverse object tree
        for (const k of keys) {
            // Make sure key has a value
            if (k !== '') {
                if (item !== undefined && item !==  null && item.hasOwnProperty(k)) {
                    item = item[k];
                } else {
                    return null;
                }
            }
        }
        return item;
    }
    /**
     * Wrapper function for get()
     * @param key Name of the setting to get
     * @return {any}     Returns the value stored in the settings or null
     */
    public setting(key: string) {
        return this.get(key);
    }

    public setProperty(name: string, value: any) {
        if (this.model.subjects[name]) {
            this.model.subjects[name].next(value);
        }
    }

    public getProperty(name: string) {
        if (this.model.subjects[name]) {
            return this.model.subjects[name].getValue();
        }
        return null;
    }

    public listen(name: string, next: (value: any) => void) {
        if (this.model.observers[name]) {
            return this.model.observers[name].subscribe(next);
        }
        return null;
    }
    /**
     * Sets the loading state of the application
     * @param state Loading state of the application
     * @return none
     */
    public loading(state: boolean) {
        this.setProperty('loading', state);
    }
    /**
     * Returns an object to observe the loading state of the application
     * @return {Observable<boolean>} Observer which updates on the changes to the application's loading state
     */
    public loadingState(next: (value: any) => {}) {
        return this.listen('loading', next);
    }

    public loadingText(next: (value: any) => {}) {
        if (this.timers.loading) {
            clearInterval(this.timers.loading);
            this.model.loading.state = 0;
            const state = `${this.model.loading.prefix}${this.model.loading.text[this.model.loading.state]}`;
            this.setProperty('loading_text', state);
        }
        this.timers.loading = setInterval(() => {
            const state = `${this.model.loading.prefix}${this.model.loading.text[this.model.loading.state]}`;
            this.setProperty('loading_text', state);
        }, 1 * 60 * 1000);
        return this.listen('loading_text', next);
    }

    /**
     * Check if browser is a mobile browser
     * @return {boolean} Returns whether or not the browser is mobile or not.
     */
    public mobile() {
        return Utils.isMobileDevice();
    }

    /**
     * Toggles fullscreen on and off
     * @return none
     */
    public toggleFullScreen() {
        const doc: any = window.document;
        const docEl: any = doc.documentElement;

        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen ||
            docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen ||
            doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement &&
            !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        } else {
            cancelFullScreen.call(doc);
        }
    }

    /**
     * Loads all the keys from local storage into the settings.
     * @return none
     */
    private loadStore() {
        // Load local store settings
        if (this.store) {
            for (let i = 0; i < this.store.length; i++) {
                let key = this.store.key(i);
                const item = this.store.getItem(key);
                if (item !== undefined && item !== null && item !== '') {
                    if (key.indexOf(`APP.`) === 0) {
                        key = key.replace(`APP.`, '');
                    }
                    if (!this.model.settings.store) {
                        this.model.settings.store = {};
                    }
                    this.model.settings.store[key] = item;
                }
            }
        }
    }
}
