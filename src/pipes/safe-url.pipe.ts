/**
* @Author: Alex Sorafumo
* @Date:   18/11/2016 4:31 PM
* @Email:  alex@yuion.net
* @Filename: safe-url.pipe.ts
* @Last modified by:   Alex Sorafumo
* @Last modified time: 15/12/2016 11:36 AM
*/

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeurl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
