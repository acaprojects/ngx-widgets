/**
* @Author: Alex Sorafumo
* @Date:   18/11/2016 4:31 PM
* @Email:  alex@yuion.net
* @Filename: map.service.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 15/12/2016 11:37 AM
*/

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
			            err => {
							if(window['debug']) console.error(`[WIDGETS] [Map Service] Unable to load map with url '${map_url}'`);
							reject(err);
						}, () => {
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
