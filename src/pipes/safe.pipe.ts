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
