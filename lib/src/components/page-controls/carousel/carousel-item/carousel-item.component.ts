
import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel.component';

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
export class CarouselItemComponent {
    public parent: CarouselComponent;
    public model: any = {};

    public tap() {
        if (this.parent) {
            this.parent.tap(this.model.index);
        }
    }
}