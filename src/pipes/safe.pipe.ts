/**
* @Author: Alex Sorafumo
* @Date:   04/10/2016 12:07 PM
* @Email:  alex@yuion.net
* @Filename: safe.pipe.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 15/12/2016 11:36 AM
*/

import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'safe'})
export class SafePipe {
    constructor(private sanitizer: DomSanitizer){
        this.sanitizer = sanitizer;
    }

    transform(style: string): any {
        return this.sanitizer.bypassSecurityTrustHtml(style);
    }
}
