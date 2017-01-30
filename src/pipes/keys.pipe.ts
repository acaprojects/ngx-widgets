/**
* @Author: Alex Sorafumo
* @Date:   13/10/2016 11:13 AM
* @Email:  alex@yuion.net
* @Filename: keys.pipe.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 27/01/2017 1:19 PM
*/

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
    /**
     * Turns a object into a key, value pair array
     * @param  {any}      value Object input
     * @param  {string[]} args  [description]
     * @return {any}            Returns an Array with the key, value pairs of the object
     */
    transform(value: any, args:string[]) : any {
        if (!value) {
            return value;
        }

        let keys: any[] = [];
        for (let key in value) {
            keys.push({key: key, value: value[key]});
        }
        return keys;
    }
}
