
import { Component } from '@angular/core';

import * as Remarkable from 'remarkable';

@Component({
    selector: 'map-showcase',
    templateUrl: './map-showcase.template.html',
    styleUrls: ['./map-showcase.styles.scss']
})
export class MapShowcaseComponent {
    public model: any = {
        title: 'Interactive Map',
        bindings: [
            { name: 'src', type: 'input', description: 'Path to the map file. Only supports SVG files' }
        ],
        inject: '',
        map: {}
    };

    public ngOnInit() {
        this.model.inject = `&lt;map [src]=&quot;map_file&quot;
     [styles]=&quot;map_styles&quot;
     [focus]=&quot;map_focus&quot;
     (event)=&quot;doSomething($event)&quot;&gt;
&lt;/map&gt;`;
        console.log(this.model.inject);
    }
}
