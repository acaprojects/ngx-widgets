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
     * @param value Object input
     * @param args  [description]
     * @return Returns an Array with the key, value pairs of the object
     */
     public transform(value: any, args: string[]): any {
         if (!value) {
             return value;
         }

         const keys: any[] = [];
         for (const key in value) {
             if (key && value[key]) {
                 keys.push({key, value: value[key]});
             }
         }
         return keys;
     }
 }
