# Angular 2 - Widgets

## Usage

Import the desired widget into your component.

All two-way bindings can be read on one-way binding `<attribute>Change`. e.g. `stateChange`

[Hammer.js](http://hammerjs.github.io/) version 2.x.x is required for the sliders and interactive map widgets

### Button Toggle

A simple button for toggling.

Import `import { ButtonToggle } from '@aca/a2-widgets';`

To use a Button Toggle in your component for import the ButtonToggle directive into your component.

Then you can use insert a btn-toggle tag into you html when you want the element to appear.

e.g. 
```html
<btn-toggle active="Active" inactive="Inactive" [(value)]="value"></btn-toggle>
```

A Button Toggle has 3 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`active`| One-way | Write-only | String | Used to define the text displayed inside the button when it is in an active state.
`inactive`| One-way | Write-only | String | Used to define the text displayed inside the button when it is in an inactive state.
`value`| Two-way | Read & Write | Boolean | Used to get and set the state of the button

### Button Groups

A group of button toggles

![Image of Button Group](https://cloud.githubusercontent.com/assets/20103948/17200830/e6144846-54cb-11e6-9c1a-214a15f5f7ad.png)

Import `import { ButtonGroup } from '@aca/a2-widgets';`

To use a button group in your component for import the ButtonGroup directive into your component.

Then you can use insert a btn-group tag into you html when you want the element to appear.

e.g. 
```html
<btn-group [items]="['One', 'Two', 'Three', 'Four']" [(selected)]="value"></btn-group>
```

A Button Group has 2 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`items`| One-way | Write-only | String Array | Used to define the text displayed on each of the buttons.
`selected`| Two-way | Read & Write | Integer | Used to get and set the index of the button that is selected within the group.

### Toggle Buttons

An array of various types of customisable toggle buttons.

Import `import { FancyToggle } from '@aca/a2-widgets';`

To use a fancy toggle button in your component for import the FancyToggle directive into your component.

Then you can use insert a fancy-toggle tag into you html when you want the element to appear.

The following attributes are common for all fancy toggle buttons.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`type`| One-way | Write-only | String | Used to select the type of toggle button that you wish to use. Value can be 'text', 'image', 'icon', and 'ios'.
`state`| Two-way | Read & Write | Boolean | Used to get and set the state of the toggle


#### Text Toggle

![Image of Text Toggle](https://cloud.githubusercontent.com/assets/20103948/17200838/e66ef50c-54cb-11e6-83e6-2994dbb055b7.png)

Creates a toggle switch that display text inside the toggle space.

e.g. 
```html
<fancy-toggle type="text" [(state)]="value" inactive="Off" active="On"></fancy-toggle>
```

A Text Toggle has 2 other attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`active`| One-way | Write-only | String | Used to define the text displayed inside the toggle when it is in an active state.
`inactive`| One-way | Write-only | String | Used to define the text displayed inside the toggle when it is in an inactive state.

#### Image Toggle

![Image of Image Toggle](https://cloud.githubusercontent.com/assets/20103948/17200836/e669e7ec-54cb-11e6-9f70-18fb15432ec7.png)

Creates a toggle switch that displays an image based off of the state of the toggle

e.g. 
```html
<fancy-toggle type="image" [(state)]="value" inactive="/img/off_img.png" active="/img/on_img.png"></fancy-toggle>
```

A Image Toggle has 2 other attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`active`| One-way | Write-only | String | Used to define the image file used for the toggle when it is in an active state.
`inactive`| One-way | Write-only | String | Used to define the image file used for the toggle when it is in an inactive state.

#### Icon Toggle

![Image of Icon Toggle](https://cloud.githubusercontent.com/assets/20103948/17200835/e62640e6-54cb-11e6-9417-16eaafe6a512.png)

Creates a toggle switch that displays an icon based off of the state of the toggle.

e.g. 
```html
<fancy-toggle type="image" [(state)]="value" inactive="fa fa-times" active="fa fa-tick"></fancy-toggle>
```

A Image Toggle has 3 other attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`active`| One-way | Write-only | String | Used to define the icon css classes used for the toggle when it is in an active state.
`inactive`| One-way | Write-only | String | Used to define the icon css classes used for the toggle when it is in an inactive state.
`shape`| One-way | Write-only | String | Used to define the shape of the bound box of the toggle. Value can be `circle` or `square`

#### iOS Toggle

![Image of iOS Toggle](https://cloud.githubusercontent.com/assets/20103948/17200837/e66d32ee-54cb-11e6-94ce-c38d6cfe0eb2.png)

Creates a simple toggle switch that looks like the toggles used in iOS.

e.g. 
```html
<fancy-toggle type="ios" [(state)]="value" inactive="Off" active="On"></fancy-toggle>
```

A iOS Toggle has no other attributes that can be set.

### Slider

![Image of Horizontal Slider](https://cloud.githubusercontent.com/assets/20103948/17200832/e61af240-54cb-11e6-8401-9f64821a1b76.png)

![Image of Vertical Slider](https://cloud.githubusercontent.com/assets/20103948/17200833/e61ea930-54cb-11e6-938f-21c7d0ad7b5d.png)

A simple slider that can be vertical or horizontal.

Import `import { Slider } from '@aca/a2-widgets';`

To use a slider in your component for import the Slider directive into your component.

Then you can use insert a slider attribute into you html when you want the element to 

e.g. 
```html
<div slider align="horizontal" [min]="-65535" max="65535" [(value)]="slider2"></div>
```

A Slider has 4 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`align`| One-way | Write-only | String | Used to determine the render direction of the slider. Value can be 'horizontal', or 'vertical'.
`min`| One-way | Write-only | Integer | Used set the minimum value of the slider.
`max`| One-way | Write-only | Integer | Used set the maximum value of the slider.
`value`| Two-way | Read & Write | Integer | Used get the value of the slider.

### Tab Group

![Image of Tab Group](https://cloud.githubusercontent.com/assets/20103948/17200834/e620bebe-54cb-11e6-912c-a1d6ed4717dc.png)

Import `import { TABS_DIRECTIVES } from '@aca/a2-widgets';`

To use a tab group in your component for import the TABS_DIRECTIVES into your component.

Then you can use insert a tab-group tag into you html when you want the element to appear.

e.g. 
```html
<tab-group [(state)]="tab_value" routable="route" routeParam="tab">
    <tab-head id="0">Title of Tab</tab-head>
    <tab-body id="0">Content of Tab</tab-body>
</tab-group>
```

A TabGroup has 3 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`routable`| One-way | Write-only | String | Used to determine if the tabs read and write to the route of the application. Value can be 'route', 'query', or 'hash'.
`routeParam`| One-way | Write-only | String | Used to name the variable that is used in routing for the selection of tab.
`state`| Two-way | Read & Write | String | Used to get and set the id of the selected tab.

#### Tab Head

Inside tab groups the contents for the heading for each tab is defined within a tab-head tag

A TabHead has 1 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`id`| One-way | Write-only | String | Used to set identifier of the tab this is also used to refernce the TabBody that it matches with.

#### Tab Body

Inside tab groups the contents for the body for each tab is defined within a tab-body tag

A TabBody has 1 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`id`| One-way | Write-only | String | Used to set identifier of the tab this is also used to refernce the TabHead that it matches with.

### Interactive Map

![Image of Interactive Maps](https://cloud.githubusercontent.com/assets/20103948/17200831/e6176fb2-54cb-11e6-99c5-9348a5b1991b.png)

An interactive map which renders a svg xml which is scalable and pannable.

Import `import { InteractiveMap } from '@aca/a2-widgets';`

To use a interactive map in your component for import the InteractiveMap into your component.

Then you can use insert a interactive-map tag into you html when you want the element to appear.

The interactive map will fill the parent container so make sure you size the parent to reflect how you want your map to be displayed.

e.g. 
```html
<interactive-map map="/assets/img/map.svg" [active]="true" [controls]="true" [zoomMax]="400" (tap)="doSomething($event)"></interactive-map>
```

An Interactive Map has 5 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`map`| One-way | Write-only | String | Used to set the svg image used for the map.
`zoom`| Two-way | Read & Write | Integer | Used to set and get the zoom level of the map.
`zoomMax`| One-way | Write-only | Integer | Used to set the maximum zoom level of the map i.e. 100 + zoomMax is the max zoom in %.
`controls`| One-way | Write-only | Boolean | Used to set whether or not the zoom controls are displayed.
`tap`| One-way | Read-only | Object | Used to get classes of items inside the map that were tap/clicked on.

### Calendar

A Calendar which allows for selecting a date and time.

Import `import { Calendar } from '@aca/a2-widgets';`

To use a Calendar in your component for import the Calendar directive into your component.

Then you can use insert a calendar tag into you html when you want the element to appear.

e.g. 
```html
<calendar [(date)]="start_date" [(time)]="start_time" selectTime="true" futureOnly="true"></calendar>
```

![Image of Calendar](https://cloud.githubusercontent.com/assets/20103948/17283852/7dd71436-57f8-11e6-920c-56b04ef446ef.png)

![Image of Calendar Time picker](https://cloud.githubusercontent.com/assets/20103948/17283853/7dd982e8-57f8-11e6-92b1-f688a2ee0fd2.png)

A Calendar has 6 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`date`| Two-way | Read & Write | Date | Used to get and set the date value used by the calendar.
`minDate`| One-way | Write-only | Date | Used to define first date that is selectable by the user.
`futureOnly`| One-way | Write-only | Boolean | Sets `minDate` to the current date if true.
`selectTime`| One-way | Write-only | Boolean | Allows the user to set the time of day.
`time`| Two-way | Write-only | Object | Used to get and set the time value of the selected date. i.e. time object is { h: <hour>, m: <min> }
`minuteStep`| One-way | Write-only | Integer | Sets number of minutes the added or removed when minutes is changed.


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
