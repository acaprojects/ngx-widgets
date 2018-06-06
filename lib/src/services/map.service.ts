
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment_api from 'moment';
const moment = moment_api;

const MAP_EXPIRY = 7 * 24 * 60 * 60 * 1000;

@Injectable({
    providedIn: 'root'
})
export class MapService {
    private maps: any = {};
    private map_trees: any = {};

    constructor(private http: HttpClient) {
        if (sessionStorage) {
            for (var i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key.indexOf('WIDGETS.map.tree.') >= 0) {
                    const url = key.replace('WIDGETS.map.tree.', '').split('.').join('/') + '.svg';
                    const tree = JSON.parse(sessionStorage.getItem(key));
                    if (tree && tree.expiry && moment().isBefore(moment(tree.expiry))) {
                        this.map_trees[url] = tree;
                    }
                }
            }
        }
    }

    /**
     * Loads the map with the given URL
     * @param url URL of the map to load
     */
    public loadMap(url: string) {
        return new Promise((resolve, reject) => {
            if (!url) { return resolve(''); }
            const now = (new Date()).getTime();
            if (this.maps[url] && this.maps[url].expiry > now) {
                resolve(this.maps[url].data);
            } else {
                let map: any = null;
                this.map_trees[url] = null;
                this.http.get(url, { responseType: 'text' }).subscribe((data) => {
                    map = data;
                        // Prevent non SVG files from being used
                    if (!map.match(/<\/svg>/g)) { map = ''; }
                        // Prevent Adobe generic style names from being used
                    map = map.replace(/cls-/g, `map-${Object.keys(this.maps).length}-`);
                    map = map.replace(/\.map/g, `svg .map`);
                },
                (err) => reject(err),
                () => {
                    if (map) {
                        this.maps[url] = {
                            expiry: now + MAP_EXPIRY,
                            data: map,
                        };
                        // if (!this.map_trees[url] || moment().isAfter(moment(this.map_trees[url].expiry))) {
                        //     this.loadMapTree(url);
                        // }
                        resolve(map);
                    } else {
                        reject('Invalid SVG map');
                    }
                });
            }
        });
    }

    /**
     * Loads the map tree of the map with the give URL
     * @param url URL of the map
     */
    public loadMapTree(url: string) {
        return new Promise((resolve, reject) => {
            let tree = null;
            this.http.get(`${url}.maptree.json`).subscribe(
                (data) => tree = data,
                (err) => reject(err),
                () => {
                    if (tree) {
                        this.setMapTree(url, tree, false);
                    }
                }
            )
        });
    }

    /**
     * Gets the map tree of the map with the given URL
     * @param url URL of the map
     */
    public getMapTree(url: string) {
        return this.map_trees[url] ? this.map_trees[url].tree : null;
    }

    /**
     * Sets the map tree of the map with the given URL
     * @param url URL of the map tree's file
     * @param tree Element position tree of the given map URL
     * @param expire Sets whether the tree data will expire
     */
    public setMapTree(url: string, tree: any, expire: boolean = true) {
        let expiry = moment().add(1, 'days').valueOf();
        if (!expire) {
            expiry = Math.floor(expiry + 365 * 24 * 60 * 60 * 1000);
        }
        this.map_trees[url] = { expiry, tree };
        if (sessionStorage) {
            sessionStorage.setItem(`WIDGETS.maps.tree.${url.split('.')[0].split('/').join('.')}`, JSON.stringify(this.map_trees[url]));
        }
    }

    /**
     * Clears all the cached map data
     */
    public clear() {
        this.maps = {};
    }
}
