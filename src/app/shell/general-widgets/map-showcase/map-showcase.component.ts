
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
            { name: 'src', type: 'input', description: 'Path to the map file. Only supports SVG files', data: 'string' },
            { name: 'styles', type: 'input', description: 'Map of styles to apply to the displayed SVG map', data: 'object' },
            { name: 'poi', type: 'input', description: 'Points of interest which components can be placed', data: 'object[]' },
            { name: 'focus', type: 'input', description: 'Element within the map to focus upon', data: 'object[]' },
            { name: 'zoom', type: 'both', description: 'Zoom level of the map 0 is 100%', data: 'number' },
            { name: 'center', type: 'both', description: 'Element within the map to focus upon', data: 'object' },
            { name: 'event', type: 'output', description: 'Events posted by the map get emitted', data: 'object' }
        ],
        inject: '',
        map: {}
    };

    public ngOnInit() {
        this.model.inject = `&lt;map [src]=&quot;map_file&quot;
     [styles]=&quot;map_styles&quot;
     [poi]=&quot;map_styles&quot;
     [focus]=&quot;map_focus&quot;
     (event)=&quot;doSomething($event)&quot;&gt;
&lt;/map&gt;`;
        console.log(this.model.inject);
    }
}
