
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment_api from 'moment';
const moment = moment_api;

const MAP_EXPIRY = 7 * 24 * 60 * 60 * 1000;

@Injectable()
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

    public loadMap(url: string) {
        return new Promise((resolve, reject) => {
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
                },
                (err) => reject(err),
                () => {
                    if (map) {
                        this.maps[url] = {
                            expiry: now + MAP_EXPIRY,
                            data: map,
                        };
                        resolve(map);
                    }
                });
            }
        });
    }

    public getMapTree(url: string) {
        return this.map_trees[url] ? this.map_trees[url].tree : null;
    }

    public setMapTree(url: string, tree: any) {
        this.map_trees[url] = {
            expiry: moment().add(1, 'days').valueOf(),
            tree
        };
        if (sessionStorage) {
            sessionStorage.setItem(`WIDGETS.maps.tree.${url.split('.')[0].split('/').join('.')}`, JSON.stringify(this.map_trees[url]));
        }
    }

    public clear() {
        this.maps = {};
    }
}
