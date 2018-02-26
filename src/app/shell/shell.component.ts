
import { Component } from '@angular/core';
import { WIDGETS } from '../../../lib/src/settings';

@Component({
    selector: 'app-shell',
    templateUrl: './shell.template.html',
    styleUrls: ['./shell.styles.scss']
})
export class AppShellComponent {
    version: string = WIDGETS.app_version;
}
