
### Toggle Buttons

An array of various types of customisable toggle buttons.

Import `import { FancyToggle } from '@aca-1/a2-widgets';`

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

Import `import { Slider } from '@aca-1/a2-widgets';`

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

### Calendar

A Calendar which allows for selecting a date and time.

Import `import { Calendar } from '@aca-1/a2-widgets';`

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
`date`      | Two-way | Read & Write | Date | Used to get and set the date value used by the calendar.
`minDate`   | One-way | Write-only | Date | Used to define first date that is selectable by the user.
`futureOnly`| One-way | Write-only | Boolean | Sets `minDate` to the current date if true.
`selectTime`| One-way | Write-only | Boolean | Allows the user to set the time of day.
`time`      | Two-way | Write-only | Object | Used to get and set the time value of the selected date. i.e. time object is `{ h: Integer, m: Integer }`
`minuteStep`| One-way | Write-only | Integer | Sets number of minutes the added or removed when minutes is changed.
