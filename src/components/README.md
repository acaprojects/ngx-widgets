
# Angular 2 - Widgets

## [Source Documentation](../README.md)

## Component Listing
- [Buttons](./components/buttons/README.md)
 - [Buttons](./components/buttons/README.md)
 - [Button Groups](./components/buttons/README.md)
 - [Button Toggles](./components/buttons/README.md)
- [Form Controls](./components/form-controls/README.md)
 - [Calendars](./components/form-controls/README.md)
 - [Data Inputs](./components/form-controls/README.md)
 - [Dropdowns](./components/form-controls/README.md)
 - [Sliders](./components/form-controls/README.md)
 - [Time Pickers](./components/form-controls/README.md)
 - [Toggles](./components/form-controls/README.md)
 - [Typeaheads](./components/form-controls/README.md)
- [Page Controls](./components/page-controls/README.md)
 - [Steppers](./components/page-controls/README.md)
 - [Tab Groups](./components/page-controls/README.md)
- [Modals](./components/modals/README.md)
- Other
 - [Image Cropper](### Image Cropper)
 - [Interactive Maps](### Interactive Maps)
 - [Spinners](### Spinners)
 - [Tooltips](### Tooltips)
 - [Virtual Keyboard](### Virtual Keyboard)

## Usage

Import the ACA_WIDGETS_MODULE into the module which you wish to use a component from this library.

All two-way bindings can be read on one-way binding `<attribute>Change`. e.g. `stateChange`.

[Hammer.js](http://hammerjs.github.io/) version 2.x.x is required for the sliders and interactive map widgets.

## Other Components 

### Image Cropper

UI element that allows for a user to select an image and crop it.

![Image of Image Cropper](https://cloud.githubusercontent.com/assets/20103948/17200830/e6144846-54cb-11e6-9c1a-214a15f5f7ad.png)

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

UI element that displays SVG maps that can be interactive with the user

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

UI element that displays the selected spinner/loader

![Image of Spinner](https://cloud.githubusercontent.com/assets/20103948/17200830/e6144846-54cb-11e6-9c1a-214a15f5f7ad.png)

```html
<spinner [type]="'bounce'" [color]="rgba(255,255,255,0.67)"></spinner>
```

Spinners have 2 attributes.

Name | Binding | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`type`| One-way | Write-only | String | Type of spinner to display. Options are `plane`, `bounce`, `ring-bounce`, `ring-rotate`, `ring-bounce-in`, `double-bounce`, `bars`, `cube-move`, `cube-grid`, 'dot-bounce', `dot-cicle`, `dot-circle-scale`
`color`| One-way | Write-only | Boolean | Colour of the spinner. Default: #000000

### Tooltip

### Virtual Keyboard

==========================================

## Custom Styling

All stylable elements have an attribute for adding a css class prefix to the element and attributes for setting colours.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`cssClass`| One-way | Write-only | String | Added the set value to the classes of the root element.
`color1` | One-way | Write-only | String | Sets the background colour of the element.
`color2` | One-way | Write-only | String | Sets the foreground colour of the element.
`colors` | One-way | Write-only | Object | Sets the background and foreground colours of the element. e.g. { fg: '#123456', bg: '#FFF' }

### Button

Button Toggles and Button Groups share the same CSS.

The styles of buttons can be changes using the css class `aca-btn-c1`
When a button is active the css class `active` is also applied the active element

e.g.
```css
  .aca-btn-c1 {
      /*background-color: #123456;*/
      border: 3px solid #123456;
  }

  .aca-btn-c1:hover, .btn-test .aca-btn-c1.active:hover {
      background-color: #345678;
      color: #FFFFFF;
      border: 3px solid #123456;
  }

  .aca-btn-c1.active{
      background-color: #123456;
      color: #FFFFFF;
      border: 3px solid #123456;
  }

```

### Slider
The styles of sliders can be changes using the css classes `aca-slider-c1, aca-slider-c2 & aca-slider-c3`

* `aca-slider-c1` is applied on the slider bar base.
* `aca-slider-c2` is applied on the progress strip of the bar.
* `aca-slider-c3` is applied on the knob of the slider.

e.g.
```css
  .aca-slider-c1 {
      background-color:  #123456;
  }
  .aca-slider-c2 {
      background-color:  #1239A4;
  }
  .aca-slider-c3 {
      background-color: #454545;
  }

```

## License

MIT © [Alex Sorafumo](alex@yuion.net)
