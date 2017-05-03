/**
 * @Author: Alex Sorafumo
 * @Date:   18/11/2016 4:31 PM
 * @Email:  alex@yuion.net
 * @Filename: map.service.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 27/01/2017 1:21 PM
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { WIDGETS } from '../settings';

@Injectable()
export class MapService {
    public defaults: any = {
        zoomMax: 200,
        controls: true,
        mapSize: 100,
        focusScroll: false,
        focusZoom: 80,
        padding: '2.0em',
        rotations: 0,
    };
    private maps = {};
    private map_promise = {};

    constructor(private http: Http) {
    }

    public setDefaults(options: any) {
        for (const o in options) {
            if (o in this.defaults) {
                this.defaults[o] = options[o];
            }
        }
    }

    /**
     * Gets the map from the specified URL
     * @param  {string} map_url URL of the map url
     * @return {Promise<string>} Returns the file of the specified map
     */
     public getMap(map_url: string) {
         if (this.map_promise[map_url] === undefined || this.map_promise[map_url] === null) {
             this.map_promise[map_url] = new Promise((resolve, reject) => {
                 // Check if map has already been loaded
                 if (this.maps[map_url]) {
                     resolve(this.maps[map_url]);
                 } else {
                     this.http.get(map_url).map((res) => res.text())
                         .subscribe(
                           (data) => this.maps[map_url] = data,
                           (err) => {
                               WIDGETS.error('Map(S)]', `Unable to load map with url '${map_url}'`);
                               reject(err);
                           }, () => {
                               resolve(this.maps[map_url]);
                               this.map_promise[map_url] = null;
                           },
                         );
                 }
             });
         }
         return this.map_promise[map_url];
     }
 }
