
import { Component } from '@angular/core';
import { WIDGETS } from '../../../lib/src/settings';

@Component({
    selector: 'app-shell',
    templateUrl: './shell.template.html',
    styleUrls: ['./shell.styles.scss']
})
export class AppShellComponent {
    public version: string = WIDGETS.app_version;
    public model: any = {};

    constructor() {
        this.model.menu_items = ['General Components', 'Form Control Components', 'Page Control Components', 'Directives', 'Pipes', 'Services'];
        this.model.menu = {
            'General Components': [
                { id: 'button', name: 'Button' },
                { id: 'button-group', name: 'Button Group' },
                { id: 'interactive-map', name: 'Interactive Map' },
                { id: 'image-cropper', name: 'Image Cropper' },
                { id: 'media-player', name: 'Media Player' },
                { id: 'progress-circle', name: 'Progress Circle' },
                { id: 'spinner', name: 'Spinner' },
                // { id: 'virtual-keyboard', name: 'Virtual Keyboard' },
            ],
            'Form Control Components': [
                { id: 'calendar', name: 'Calendar' },
                { id: 'checkbox', name: 'Checkbox' },
                { id: 'dropdown', name: 'Dropdown' },
                { id: 'custom-dropdown', name: 'Custom Dropdown' },
                { id: 'data-input', name: 'Data Input' },
                { id: 'radioset', name: 'Radioset' },
                { id: 'radio-button', name: 'Radio Button' },
                { id: 'slider', name: 'Slider' },
                { id: 'time-picker', name: 'Time Picker' },
                { id: 'toggle', name: 'Toggle' },
            ],
            'Page Control Components': [
                { id: 'tab-group', name: 'Tab Group' },
                { id: 'stepper', name: 'Stepper' },
            ],
            'Directives': [
                { id: 'modal', name: 'Modal' },
                { id: 'notification', name: 'Notification/Toast' },
                { id: 'tooltip', name: 'Tooltip' },
                { id: 'drop-target', name: 'Drop Target' },
                { id: 'file-stream', name: 'File Stream' },
            ],
            'Pipes': [
                { id: 'safe', name: 'Safe HTML' },
                { id: 'safe-url', name: 'Safe URL' },
                { id: 'safe-style', name: 'Safe CSS' },
                { id: 'keys', name: 'Keys' },
            ],
            'Services': [
                { id: 'drop-service', name: 'Drop Service' },
                { id: 'animate-service', name: 'Animate Service' },
                { id: 'map-service', name: 'Map Service' },
                { id: 'overlay-service', name: 'Overlay' },
            ]
        };
    }
}
