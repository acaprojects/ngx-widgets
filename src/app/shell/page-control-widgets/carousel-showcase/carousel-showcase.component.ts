
import { Component } from '@angular/core';

import * as faker from 'faker';

@Component({
    selector: 'carousel-showcase',
    templateUrl: './carousel-showcase.template.html',
    styleUrls: ['./carousel-showcase.styles.scss']
})
export class CarouselShowcaseComponent {
    // @Input() public name: string;
    // @Input() public index: number = 0;
    // @Input() public settings: ICarouselSettings;
    // @Output() public indexChange = new EventEmitter();
    // @Output() public select = new EventEmitter();
    public model: any = {
        title: 'Carousel',
        bindings: [
            {
                name: 'name', type: 'input', description: 'Name of CSS class to add to the root element', data: 'string',
                data_desc: '',
                example: `'awesome-carousel'`
            }, {
                name: 'index', type: 'both', description: 'Index of the first shown item', data: 'number',
                data_desc: ``,
                example: `5`
            }, {
                name: 'settings', type: 'input', description: 'Settings for the carousel', data: 'object',
                data_desc: `interface ICarouselSettings {
    items: {
        mobile: number;
        tablet: number;
        desktop: number;
    }
    break: {
        mobile: number;
        tablet: number;
    }
}`,
                example: `{
    items: {
        mobile: 2,
        tablet: 4,
        desktop: 6
    },
    break: {
        mobile: 736,
        tablet: 1024
    }
}`
            }, {
                name: 'select', type: 'output', description: 'Emits index of item after tap event', data: 'number',
                data_desc: ``,
                example: `3`
            }
        ],
        list: [],
        inject: '',
        state: { }
    };

    public ngOnInit() {
        this.model.list = [];
        for (let i = 0; i < 12; i++) {
            this.model.list.push(faker.image.avatar());
        }
        this.model.inject = `&lt;carousel name=&quot;the-carousel&quot;&gt;
    &lt;carousel-item&gt;Item 1&lt;/carousel-item&gt;
    &lt;carousel-item&gt;Item 2&lt;/carousel-item&gt;
    &lt;carousel-item&gt;Item 3&lt;/carousel-item&gt;
&lt;/carousel&gt;`;
    }
}
