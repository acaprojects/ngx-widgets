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

import { WIDGETS_SETTINGS } from '../settings';

@Injectable()
export class MapService {
	maps = {};
	map_promise = {};
	debug: boolean = false;

	constructor(private http: Http) {
		WIDGETS_SETTINGS.observe('debug').subscribe((data) => {
			this.debug = data;
		}, (err) => {}, () => {})
	}

	/**
	 * Gets the map from the specified URL
	 * @param  {string} map_url URL of the map url
	 * @return {Promise<string>} Returns the file of the specified map
	 */
	getMap(map_url: string) {
		if(this.map_promise[map_url] === undefined || this.map_promise[map_url] === null) {
			this.map_promise[map_url] = new Promise((resolve, reject) => {
					// Check if map has already been loaded
				if(this.maps[map_url]){
					resolve(this.maps[map_url]);
				} else {
			        this.http.get(map_url).map(res => res.text()).subscribe(
			            data => this.maps[map_url] = data,
			            err => {
							if(this.debug) console.error(`[WIDGETS][Map(S)] Unable to load map with url '${map_url}'`);
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
