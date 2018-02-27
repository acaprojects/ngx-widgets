/**
 * @Author: Alex Sorafumo
 * @Date:   04/10/2016 12:07 PM
 * @Email:  alex@yuion.net
 * @Filename: safe.pipe.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 27/01/2017 1:20 PM
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'safe'})
export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    /**
     * Sanitizes the string allowing it to be injected into a template
     * @param style String to sanitize
     * @return Sanitized string
     */
     public transform(style: string): any {
         return this.sanitizer.bypassSecurityTrustHtml(style);
     }
 }
