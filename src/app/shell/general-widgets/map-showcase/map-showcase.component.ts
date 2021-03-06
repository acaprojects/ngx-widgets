
import { Component } from '@angular/core';
import { MapRangeComponent, MapPinComponent } from '../../../../../lib/src/public_api';

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
            src: 'assets/australia.svg',
            poi: [],
            listeners: [
                { id: 'AU-WA', event: 'mouseenter', callback: () => {
                    this.model.show.hover = true;
                    this.updatePointsOfInterest();
                } },
                { id: 'AU-WA', event: 'mouseleave', callback: () => {
                    this.model.show.hover = false;
                    this.updatePointsOfInterest();
                } }
            ]
        },
        show: {}
    };

    public ngOnInit() {
        this.model.inject = `&lt;map [src]=&quot;map_file&quot;
     [styles]=&quot;map_styles&quot;
     [poi]=&quot;map_styles&quot;
     [focus]=&quot;map_focus&quot;
     (event)=&quot;doSomething($event)&quot;&gt;
&lt;/map&gt;`;
    }

    public togglePin() {
        this.model.show.pin = !this.model.show.pin;
        this.updatePointsOfInterest();
    }

    public toggleRadius() {
        this.model.show.radius = !this.model.show.radius;
        this.updatePointsOfInterest();
    }

    public toggleMap() {
        this.model.map.src = this.model.map.src.indexOf('180') >= 0 ? 'assets/australia.svg' : 'assets/australia-180-rot.svg';
    }

    public updatePointsOfInterest() {
        this.model.map.poi = [];
        if (this.model.show.radius) {
            this.model.map.poi.push({
                id: 'Nyada',
                coordinates:  { x: 3000, y: 3000 },
                content: MapRangeComponent,
                data: { text: `I'm somewhere in this circle`, diameter: 10 }
            })
        }
        if (this.model.show.pin) {
            this.model.fixed = !this.model.fixed;
            const fixed = this.model.fixed;
            this.model.map.poi.push({
                id: fixed ? 'AU-NSW' : 'Nyada',
                coordinates: fixed ? null : { x: 5000, y: 7500 },
                content: MapPinComponent,
                data: { text: fixed ? 'NSW is here' : `I'm currently round here` }
            });
            const focus: any = {};
            if (fixed) { focus.id = 'AU-NSW'; }
            else { focus.coordinates = { x: 5000, y: 7500 }; }
            this.model.map.focus = focus;
            this.model.map.styles = {
                '#AU-NSW': { fill: ['#123456', '#345612', '#561234'][Math.floor(Math.random() * 3)] },
                '#AU-WA:hover': {
                    fill: ['#654321', '#436521', '#216543'][Math.floor(Math.random() * 3)],
                    transition: 'fill 200ms'
                }
            };
        }
        if (this.model.show.hover) {
            this.model.map.poi.push({
                id: 'AU-WA',
                coordinates: null,
                content: MapPinComponent,
                data: { text: 'This state is WA' }
            })
        }
    }
}
