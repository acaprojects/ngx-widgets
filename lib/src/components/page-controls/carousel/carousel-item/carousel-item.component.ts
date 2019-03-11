
import { Component, OnInit } from '@angular/core';

import { CarouselComponent } from '../carousel.component';
import { BaseWidgetComponent } from '../../../../shared/base.component';

export interface ICarouselSettings {
    items: {
        mobile: number;
        tablet: number;
        desktop: number;
    }
}

@Component({
    selector: 'carousel-item',
    templateUrl: './carousel-item.template.html',
    styleUrls: ['./carousel-item.styles.scss']
})
export class CarouselItemComponent extends BaseWidgetComponent implements OnInit {
    public parent: CarouselComponent;
    public model: { [name: string]: any } = {};

    public ngOnInit(): void {
        this.timeout('show', () => this.model.show = true);
    }

    public tap() {
        if (this.parent) {
            this.parent.tap(this.model.index);
        }
    }
}