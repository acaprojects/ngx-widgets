/**
 * @Author: Alex Sorafumo <alex.sorafumo>
 * @Date:   12/01/2017 2:25 PM
 * @Email:  alex@yuion.net
 * @Filename: app.service.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 03/02/2017 10:25 AM
 */

import { Location } from '@angular/common';
import { Inject, Injectable, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { OverlayService } from '../../../lib/src/public_api';

import { SettingsService } from './settings.service';
import { Utils } from '../shared/utility.class';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private _system = '';
    private subjects: any = {};
    private observers: any = {};

    private prev_route: string[] = [];
    private model: any = {};

    constructor(private _title: Title,
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        private overlay: OverlayService,
        private settings: SettingsService
    ) {
        this.init();
    }

    get endpoint() {
        const host = this.Settings.get('composer.domain');
        const protocol = this.Settings.get('composer.protocol');
        const port = ((protocol === 'https:') ? '443' : '80');
        const url = `${protocol}//${host}`;
        const api_endpoint = `${url}`;
        return api_endpoint;
    }

    public init() {
        if (!this.settings.setup) {
            return setTimeout(() => this.init(), 500);
        }
        this.model.title = this.settings.get('app.title') || 'Angular Application';
    }

    get Settings() { return this.settings; }
    // get Systems() { return this.systems; }
    get Overlay() { return this.overlay; }

    set title(str: string) {
        this._title.setTitle(`${str ? str + ' | ' : ''}${this.model.title}`);
    }

    public navigate(path: string, query?: any) {
        const path_list = [];
        path_list.push(path);
        this.prev_route.push(this.router.url);
        // if (!this.systems.resources.authLoaded) {
        this.router.navigate(path_list, { queryParams: query });
        // } else {
        // this.router.navigate([path]);
        // }
    }

    public back() {
        if (this.prev_route.length > 0) {
            this.navigate(this.prev_route.pop());
            this.prev_route.pop();
        } else {
            this.navigate('');
        }
    }

    public log(type: string, msg: string, args?: any, stream: string = 'debug') {
        this.settings.log(type, msg, args, stream);
    }

    public error(msg: string, action?: string, event?: () => void) {
        const message = msg ? msg : `Error`;
        this.overlay.notify('success', {
            html: `<div class="display-icon error" style="font-size:2.0em"></div><div>${message}</div>`,
            name: 'ntfy error',
            action
        });
    }

    public success(msg: string, action?: string, event?: () => void) {
        const message = msg ? msg : `Success`;
        this.overlay.notify('success', {
            html: `<div class="display-icon success" style="font-size:2.0em"></div><div>${message}</div>`,
            name: 'ntfy success',
            action
        }, event);
    }

    public info(msg: string, action?: string, event?: () => void) {
        const message = msg ? msg : `Information`;
        this.overlay.notify('info', {
            html: `<div class="display-icon info" style="font-size:2.0em"></div></div><div>${message}</div>`,
            name: 'ntfy info',
            action
        }, event);
    }

    get iOS() {
        return Utils.isMobileSafari();
    }

}
