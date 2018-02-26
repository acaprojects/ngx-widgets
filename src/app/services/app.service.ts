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
import { Observable } from 'rxjs/Observable';

import { OverlayService } from '../../../lib/src/public_api';

import { SettingsService } from './settings.service';
import { Utils } from '../shared/utility.class';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
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
        this.router.events.subscribe((event: any) => {
            console.error('Nav event:', event);
        })
    }

    get endpoint() {
        const host = this.Settings.get('composer.domain');
        const protocol = this.Settings.get('composer.protocol');
        const port = ((protocol === 'https:') ? '443' : '80');
        const url = `${protocol}//${host}`;
        const api_endpoint = `${url}`;
        return api_endpoint;
    }

    public initSystem(sys: string) {
        this._system = sys;
        if (!this._system || this._system === '') {
            if (localStorage) {
                this._system = localStorage.getItem('ACA.CONTROL.system');
                if (this.subjects.system) {
                    this.subjects.system.next(this._system);
                }
            }
            if (!this._system || this._system === '') {
                this.navigate('bootstrap', null, false);
            } else {
                this.navigate('');
            }
        } else {
            if (this.subjects.system) {
                this.subjects.system.next(this._system);
            }
        }
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

    public navigate(path: string, query?: any, add_base: boolean = true) {
        const path_list = [];
        if (add_base) {
            path_list.push('_');
            path_list.push(this._system);
        }
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
            this.navigate(this.prev_route.pop(), null, false);
            this.prev_route.pop();
        } else {
            this.navigate('');
        }
    }

    public log(type: string, msg: string, args?: any, stream: string = 'debug') {
        this.settings.log(type, msg, args, stream);
    }

    public error(msg: string, action: string) {
        const message = msg ? msg : `Error`;
        this.overlay.notify('success', {
            innerHtml: `
            <div class="display-icon error" style="font-size:2.0em"></div><
            div>${message}</div>`,
            name: 'error-notify',
        });
    }

    public success(msg: string, action: string) {
        const message = msg ? msg : `Success`;
        this.overlay.notify('success', {
            innerHtml: `
            <div class="display-icon success" style="font-size:2.0em"></div>
            <div>${message}</div>`,
            name: 'success-notify',
        });
    }

    public info(msg: string, action: string) {
        const message = msg ? msg : `Information`;
        this.overlay.notify('info', {
            innerHtml: `
            <div class="display-icon info" style="font-size:2.0em"></div>
            </div><div>${message}</div>`,
            name: 'info-notify',
        });
    }

    get iOS() {
        return Utils.isMobileSafari();
    }

}
