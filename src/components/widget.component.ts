/*
 * @Author: Alex Sorafumo
 * @Date:   2017-03-10 11:56:00
 * @Last Modified by:   Alex Sorafumo
 * @Last Modified time: 2017-05-03 14:40:40
 */

import { Component, Input, Renderer } from '@angular/core';

@Component({
    selector: 'aca-widget',
    template: '<div class="widget"></div>',
})
export class WidgetComponent {
    @Input() public cssClass: string = 'default';

    protected theme: any = {};
    protected component_name: string = 'widget';
    protected theme_sub: any = null;
    protected cmp_elements: any = {};

    constructor(private theme_service: WidgetThemeService, private renderer: Renderer) {
        this.theme_sub = theme_service.listener().subscribe((theme) => {
            this.theme = theme;
            this.updateTheme();
        }, (err) => {
            return;
        }, () => {
            return;
        });
    }

    public ngAfterViewInit() {
        this.updateTheme();
    }

    public ngOnDestory() {
        if (this.theme_sub) {
            this.theme_sub.unsubscribe();
        }
    }

    private updateTheme() {
        if (this.theme && this.theme[this.component_name]) {
            const theme = this.theme[this.component_name];
            for (const el in theme) {
                if (this.cmp_elements[el]) {
                    for (const style in theme[el]) {
                        if (theme[el][style]) {
                            this.renderer.setElementStyle(this.cmp_elements[el], style, theme[el][style]);
                        }
                    }
                }
            }
        }
    }
}