
# Angular 2 - Widgets

## [Component Documentation](../README.md)

- Form Controls
 - Calendars
 - Data Inputs
 - Dropdowns
 - Sliders
 - Time Pickers
 - Toggles
 - Typeaheads

### Calendar

A visual Calendar which allows for selecting a date.

e.g.
```html
<calendar [(date)]="start_date" [(time)]="start_time" selectTime="true" futureOnly="true"></calendar>
```

![Image of Calendar](https://cloud.githubusercontent.com/assets/20103948/17283852/7dd71436-57f8-11e6-920c-56b04ef446ef.png)

Calendars have 3 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`date`      | Two-way | Read & Write | Date | Used to get and set the date value used by the calendar.
`minDate`   | One-way | Write-only | Date | Used to define first date that is selectable by the user.
`futureOnly`| One-way | Write-only | Boolean | Sets `minDate` to the current date if true.

### Data Inputs

UI element that allows for a user to select an image and crop it.

![Data Input](https://cloud.githubusercontent.com/assets/20103948/22870777/96845822-f1fe-11e6-8f9e-f9f48d10615d.png)

```html
<data-input></data-input>
```

Data Inputs have 7 attributes.

Name | Binding | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`id`| One-way | Write-only | String | Stream ID to look for an file on. Default: 'zero'

### Dropdown

:TODO Write description

![Dropdown](https://cloud.githubusercontent.com/assets/20103948/22871518/a504e374-f205-11e6-8bd2-05455984b6b3.png)

```html
<dropdown></dropdown>
```

Dropdowns have 7 attributes.

Name | Binding | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`id`| One-way | Write-only | String | Stream ID to look for an file on. Default: 'zero'

### Slider

A simple slider that can be vertical or horizontal.

![Image of Horizontal Slider](https://cloud.githubusercontent.com/assets/20103948/17200832/e61af240-54cb-11e6-8401-9f64821a1b76.png)

![Image of Vertical Slider](https://cloud.githubusercontent.com/assets/20103948/17200833/e61ea930-54cb-11e6-938f-21c7d0ad7b5d.png)

e.g.
```html
<slider align="horizontal" [min]="-65535" max="65535" [(value)]="slider2"></slider>
```

A Slider has 4 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`align`| One-way | Write-only | String | Used to determine the render direction of the slider. Value can be 'horizontal', or 'vertical'.
`min`| One-way | Write-only | Number | Used set the minimum value of the slider.
`max`| One-way | Write-only | Number | Used set the maximum value of the slider.
`value`| Two-way | Read & Write | Number | Used get the value of the slider.


### Time Picker

A input form that allow for the user to select a time.

e.g.
```html
<time-picker [(time)]="start_date" ></calendar>
```

![Image of Calendar Time picker](https://cloud.githubusercontent.com/assets/20103948/17283853/7dd982e8-57f8-11e6-92b1-f688a2ee0fd2.png)

Time Pickers have 2 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`time`      | Two-way | Write-only | Object | Used to get and set the time value of the selected date. i.e. time object is `{ h: Number, m: Number }`
`minuteStep`| One-way | Write-only | Number | Sets number of minutes the added or removed when minutes is changed.


### Toggle Buttons

An variety of customisable toggle buttons.

```html
<fancy-toggle type="text" [(state)]="active"></fancy-toggle>
```

The following attributes are common for all fancy toggle buttons.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`type`| One-way | Write-only | String | Used to select the type of toggle button that you wish to use. Value can be 'text', 'image', 'icon', and 'ios'.
`state`| Two-way | Read & Write | Boolean | Used to get and set the state of the toggle

#### Toggle - Text

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

#### Toggle - Image

![Image Toggle](https://cloud.githubusercontent.com/assets/20103948/22870871/bc88c5ac-f1ff-11e6-80fa-ebe3e00c4490.png)

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

#### Toggle - Icon

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

#### Toggle - iOS

![Image of iOS Toggle](https://cloud.githubusercontent.com/assets/20103948/17200837/e66d32ee-54cb-11e6-94ce-c38d6cfe0eb2.png)

Creates a simple toggle switch that looks like the toggles used in iOS.

e.g.
```html
<fancy-toggle type="ios" [(state)]="value" inactive="Off" active="On"></fancy-toggle>
```

A iOS Toggle has no other attributes that can be set.


### Typeaheads

:TODO Write description

![Typeahead](https://cloud.githubusercontent.com/assets/20103948/22871508/90a38188-f205-11e6-8095-0786de6d17f7.png)

```html
<typeahead></typeahead>
```

Typeaheads have 7 attributes.

Name | Binding | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`id`| One-way | Write-only | String | Stream ID to look for an file on. Default: 'zero'
