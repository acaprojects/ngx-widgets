
import { Component } from '@angular/core';

@Component({
    selector: 'map-showcase',
    templateUrl: './map-showcase.template.html',
    styleUrls: ['./map-showcase.styles.scss']
})
export class MapShowcaseComponent {
    public model: any = {
        title: 'Interactive Map',
        bindings: [
            {
                name: 'src', type: 'input', description: 'Path to the map file. Only supports SVG files', data: 'string',
                data_desc: '',
                example: `'assets/australia.svg'`
            }, {
                name: 'styles', type: 'input', description: 'Map of styles to apply to the displayed SVG map', data: 'object',
                data_desc: `{
    &lt;element_id|css_selector&gt;: {
        &lt;css_property>: &lt;value&gt;
    }
    ...
}`,
                example: `{
    'AU-NSW' : {
        fill: '#fff',
        stroke: '#eee',
        opacity: .54
    },
    '[id^="AU-"]' : {
        fill: '#123456'
    }
}`
            }, {
                name: 'poi', type: 'input', description: 'Points of interest which components can be placed', data: 'object[]',
                data_desc: `[
    {
        id?: string;       // CSS Selector ID of element with map
        name: string;      // Identifier for the point of interest
        coordinates?: {    // Coordinates of the point of interest on the map
            x: number,     // X position with the map
            y: number      // Y position with the map
        };
        cmp: Type&lt;any&gt;;    // Component to render inside container at the given location
        data: any          // Data to be bound to the model of the given component
    },
    ...
]`,
                example: `[
    {
        id: 'AU-NSW',
        name: 'Book Table',
        cmp: TableBookingComponent,
        data: {
            date: new Date(),
            user: 'Bob Jane'
        }
    }
]`
            }, {
                name: 'focus', type: 'input', description: 'Element within the map to focus upon', data: 'object[]',
                data_desc: `{
    id?: string;        // CSS Selector ID of element with map
    coordinates?: {     // Coordinates of the point of interest on the map
        x: number,      // X position with the map
        y: number       // Y position with the map
    };
    zoom?: number;      // Zoom value to focus on the item.
    lock?: boolean;     // Fix the position and zoom of the map
}`,
                example: `{
    id: 'AU-NSW',
    zoom: 100,
    lock: true
}`
            }, {
                name: 'units', type: 'input', description: 'Number of units that represent the width of the SVG map. Defaults to 10000', data: 'number',
                data_desc: '',
                example: `1000`
            }, {
                name: 'zoom', type: 'both', description: 'Zoom level of the map 0 is 100%', data: 'number',
                data_desc: '',
                example: `300`
            }, {
                name: 'center', type: 'both', description: 'Position of the center of the map. Values range from 0 to 1', data: 'object',
                data_desc: `{
    x: number,
    y: number
}`,
                example: `{
    x: .6870,
    y: .1237
}`
            }, {
                name: 'event', type: 'output', description: 'Events posted by the map get emitted', data: 'object',
                data_desc: `{
    type: 'User' | 'Component'; // Type of event emitted
    event: {
        type: string;           // Event type
        map?: string;           // ID of the map component
        elements?: string[];    // IDs of the elements that the user has interacted with due to the event
    }
}`,
                example: `{
    type: 'User',
    event: {
        type: 'Tap',
        map: 'M122344',
        elements: ['AU-NSW']
    }
}`
            }
        ],
        inject: '',
        map: {
            src: 'assets/australia.svg'
        }
    };

    public ngOnInit() {
        this.model.inject = `&lt;map [src]=&quot;map_file&quot;
     [styles]=&quot;map_styles&quot;
     [poi]=&quot;map_styles&quot;
     [focus]=&quot;map_focus&quot;
     (event)=&quot;doSomething($event)&quot;&gt;
&lt;/map&gt;`;
    }
}
