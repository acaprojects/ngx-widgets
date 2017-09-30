
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const MAP_EXPIRY = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class MapService {
    private maps: any = {};

    constructor(private http: Http) {

    }

    public loadMap(url: string) {
        return new Promise((resolve, reject) => {
            const now = (new Date()).getTime();
            if (this.maps[url] && this.maps[url].expiry > now) {
                resolve(this.maps[url].data);
            } else {
                let map: any = null;
                this.http.get(url).subscribe((data) => {
                    map = data.text();
                },
                (err) => {
                    reject(err);
                },
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

    public clear() {
        this.maps = {};
    }
}
