/**
 * @Author: Alex Sorafumo
 * @Date:   18/11/2016 4:31 PM
 * @Email:  alex@yuion.net
 * @Filename: safe-url.pipe.ts
 * @Last modified by:   Alex Sorafumo
 * @Last modified time: 27/01/2017 1:20 PM
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeurl' })
export class SafeUrlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
  /**
   * Sanitizes the URL allowing it to be injected into a template
   * @param  {string} url URL to sanitize
   * @return {any} Sanitized URL
   */
   public transform(url: string): any {
       return this.sanitizer.bypassSecurityTrustResourceUrl(url);
   }
}
