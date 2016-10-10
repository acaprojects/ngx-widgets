import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class MapService {
	maps = {};
	map_promise = {};

	constructor(private http: Http) {

	}

	getMap(map_url: string) {
		if(this.map_promise[map_url] === undefined || this.map_promise[map_url] === null) {
			this.map_promise[map_url] = new Promise((resolve, reject) => {
				if(this.maps[map_url]){
					resolve(this.maps[map_url]);
				} else {
			        this.http.get(map_url).map(res => res.text()).subscribe(
			            data => this.maps[map_url] = data,
			            err => reject(err),
			            () => {
			            	resolve(this.maps[map_url]);
			            	this.map_promise[map_url] = null;
			            }
			        );
				}
			});
		}
		return this.map_promise[map_url];
	}
}