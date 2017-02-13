
# Angular 2 - Widgets

## [Source Documentation](../README.md)

## Component Listing
- [Buttons](./buttons/README.md)
 - [Buttons](./buttons/README.md)
 - [Button Groups](./buttons/README.md)
 - [Button Toggles](./buttons/README.md)
- [Form Controls](./form-controls/README.md)
 - [Calendars](./form-controls/README.md)
 - [Data Inputs](./form-controls/README.md)
 - [Dropdowns](./form-controls/README.md)
 - [Sliders](./form-controls/README.md)
 - [Time Pickers](./form-controls/README.md)
 - [Toggles](./form-controls/README.md)
 - [Typeaheads](./form-controls/README.md)
- [Page Controls](./page-controls/README.md)
 - [Steppers](./page-controls/README.md)
 - [Tab Groups](./page-controls/README.md)
- [Modals](./modals/README.md)
- Other
 - Image Cropper
 - Interactive Map
 - Spinners
 - Tooltips
 - Virtual Keyboard

## Usage

Import the ACA_WIDGETS_MODULE into the module which you wish to use a component from this library.

All two-way bindings can be read on one-way binding `<attribute>Change`. e.g. `stateChange`.

[Hammer.js](http://hammerjs.github.io/) version 2.x.x is required for the sliders and interactive map widgets.

## Other Components 

### Image Cropper

Widget for cropping image grabbed from a file stream

![Image Cropper](https://cloud.githubusercontent.com/assets/20103948/22871485/579c1d8c-f205-11e6-8453-bfaf655520b1.png)

```html
<img-crop [id]="avatar-stream" [circle]="true" [select]="true" [width]="256" (completed)="uploadAvatar($event)"></img-crop>
```

Image Croppers have 7 attributes.

Name | Binding | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`id`| One-way | Write-only | String | Stream ID to look for an file on. Default: 'zero'
`circle`| One-way | Write-only | Boolean | Crop image in a circle
`file`| One-way | Write-only | File | File to be processed by the image cropper.
`select`| One-way | Write-only | Boolean | Allow user to select an image
`ratio`| One-way | Write-only | String | Crop box width to height ratio. Default: '4:3'
`width`| One-way | Write-only | String | Width of the crop box in pixels. Default: 400
`completed`| One-way | Read-only | String | Called when the user has finished with the crop. Returns the cropped image.

### Interactive Map

Widget for display SVGs as interactive maps.

![Image of Interactive Map](https://cloud.githubusercontent.com/assets/20103948/17200830/e6144846-54cb-11e6-9c1a-214a15f5f7ad.png)

```html
<interactive-map 
    [map]="'assets/map.svg'" 
    [zoomMax]="300" 
    [zoom]="userZoom" 
    [controls]="false" 
    [disable]="['vending-machine-1']"
    [mapSize]="10000"
    [focus]="'bedroom-one'"
    [focusScroll]="true"
    [mapStyles]="[{id:'bedroom-one', fill:'#123456'}]"
    [rotations]="1"
    (mapUpdated)="showMap()"
    >
  
</interactive-map>
```

Interactive maps have 11 attributes.

Name | Binding | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`map`| One-way | Write-only | String | File name of the SVG map to load
`zoomMax`| One-way | Write-only | Integer | Max zoom value above 100% allowed. Default: 200
`zoom`| Two-way | Read & Write | Number | Zoom level of the map. Default: 0
`controls`| One-way | Write-only | Boolean | Display simple map controls. Default: true
`disable`| One-way | Write-only | String[] | List of element IDs in map to hide
`mapSize`| One-way | Write-only | Integer | Co-ordinate scale of the  width of the map Default: 100
`focus`| One-way | Write-only | String | Element ID to focus on within the map.
`focusScroll`| One-way | Write-only | Boolean | Allow user to move map around after focused on element. Default: false
`mapStyles`| One-way | Write-only | Object[] | List of element ids and styles to change on that element.
`rotations`| One-way | Write-only | Integer | Rotates the map coordinates by 90˚ x the value
`mapUpdated`| One-way | Read-only | String | Called when the map data has been loaded.

### Spinner

Widget displays the selected spinner/loader. Based off of spinkit.

[Preview](http://tobiasahlin.com/spinkit/)

```html
<spinner [type]="'bounce'" [color]="rgba(255,255,255,0.67)"></spinner>
```

Spinners have 2 attributes.

Name | Binding | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`type`| One-way | Write-only | String | Type of spinner to display. Options are `plane`, `bounce`, `ring-bounce`, `ring-rotate`, `ring-bounce-in`, `double-bounce`, `bars`, `cube-move`, `cube-grid`, 'dot-bounce', `dot-cicle`, `dot-circle-scale`
`color`| One-way | Write-only | Boolean | Colour of the spinner. Default: #000000/Black

### Tooltip

Widget displays a tooltip with injectable content.

![Image of Tooltip](https://cloud.githubusercontent.com/assets/20103948/22870109/b08848ba-f1f8-11e6-9690-e2eff842c52f.png)


```html
<div tooltip [show]="is_open" [cmp]="TooltipContentComponent" [data]="{ title: Bob }" [position]="'top" [offsetType]="'right'" [offset]="-0.5em"></div>
```

Interactive maps have 11 attributes.

Name | Binding | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`show`| One-way | Write-only | Boolean | Shows the tooltip
`cmp`| One-way | Write-only | Integer | Angular 2 Component to inject into the tooltip
`data`| Two-way | Read & Write | Number | Data to pass to injected component
`html`| Two-way | Read & Write | Number | HTML to inject into the tooltip
`position`| One-way | Write-only | Boolean | Position of the tooltip relative to the parent element. Values: top, left, bottom, right
`offsetType`| One-way | Write-only | String[] | Position the offset is applied. Values: top, left, bottom, right
`offset`| One-way | Write-only | Integer | Offset applied to the tooltip box relative to the arrow

### Virtual Keyboard

This component is still being worked on.

==========================================

## Custom Styling

All stylable elements have an attribute for adding a css class prefix to the element and attributes for setting colours.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`cssClass`| One-way | Write-only | String | Adds value to classes on the root element of the component

## License

MIT © [Alex Sorafumo](alex@yuion.net)
