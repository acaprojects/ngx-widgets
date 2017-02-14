
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

Widget for selecting a date.

e.g.
```html
<calendar [(date)]="start_date" [(time)]="start_time" selectTime="true" futureOnly="true"></calendar>
```

![Image of Calendar](https://cloud.githubusercontent.com/assets/20103948/17283852/7dd71436-57f8-11e6-920c-56b04ef446ef.png)

Calendars have 3 attributes.

Name | Bindings | Direction | Types | Description
-----|----------|-----------|-------------|------------
`date`      | Two-way | Read & Write | Date | Used to get and set the date value used by the calendar.
`minDate`   | One-way | Write-only | Date | Used to define first date that is selectable by the user.
`futureOnly`| One-way | Write-only | Boolean | Sets `minDate` to the current date if true.

### Data Inputs

Widget for inputting data into

![Data Input](https://cloud.githubusercontent.com/assets/20103948/22870777/96845822-f1fe-11e6-8f9e-f9f48d10615d.png)

```html
<data-input></data-input>
```

Data Inputs have 22 attributes.

Name | Binding | Direction | Types | Description
-----|----------|-----------|-------------|------------
`name` | One-way | Write-only   | String | Name attached to the input field
`model`| Two-way | Read & Write | String | Data for the input
`placeholder` | One-way | Write-only   | String | Field placeholder/display name
`format`| One-way | Write-only | String | Input field format e.g. 'DD/MM/YYYY'
`color`| One-way | Write-only | String | Colour of the button e.g. blue. Available colours -> [Material Design - Color](https://material.io/guidelines/style/color)
`primary`| One-way | Write-only | String | Idle colour e.g. C500. Available colours -> [Material Design - Color](https://material.io/guidelines/style/color)
`min`| One-way | Write-only | String | Minimum value for number inputs
`max`| One-way | Write-only | String | Maximum value for number inputs
`step`| One-way | Write-only | String | Value for number inputs when using arrow keys
`icon`| One-way | Write-only | String | Will the field have an icon. Icons are added as html content to the element.
`iconSide`| One-way | Write-only | String | Side of the field that the icon is displayed.
`error`| One-way | Write-only | String | Show field as red and display error message
`regex`| One-way | Write-only | String | Regular Expression for validating the field
`errorMsg`| One-way | Write-only | String | Error message to display when error is active
`infoMsg`| One-way | Write-only | String | Informational message to display below field
`disabled`| One-way | Write-only | String | Disables input into the field and slightly greys it out
`required`| One-way | Write-only | String | Field is required will error if blurred when empty
`validation`| One-way | Write-only | String | Does the field have to be validated
`decimals`| One-way | Write-only | String | Number inputs can contain decimal values
`theme`| One-way | Write-only | String | Light or dark themed fields
`width`| One-way | Write-only | String | Width of the field in `em`
`readonly`| One-way | Write-only | String | Disables field input and changes the underline to be unbroken 

### Dropdown

Widget for selection of a single item from a long list of items.

![Dropdown](https://cloud.githubusercontent.com/assets/20103948/22871518/a504e374-f205-11e6-8bd2-05455984b6b3.png)

```html
<dropdown></dropdown>
```

Dropdowns have 2 attributes.

Name | Binding | Direction | Types | Description
-----|----------|-----------|-------------|------------
`options`| One-way | Write-only | String Array | List of options that can be selected
`selected`| Two-way | Read & Write | String Array | Index of the selected option

### Slider

Widget for setting numberical values in a more physical form.

![Image of Horizontal Slider](https://cloud.githubusercontent.com/assets/20103948/17200832/e61af240-54cb-11e6-8401-9f64821a1b76.png)

![Image of Vertical Slider](https://cloud.githubusercontent.com/assets/20103948/17200833/e61ea930-54cb-11e6-938f-21c7d0ad7b5d.png)

e.g.
```html
<slider align="horizontal" [min]="-65535" max="65535" [(value)]="slider2"></slider>
```

A Slider has 5 attributes.

Name | Bindings | Direction | Types | Description
-----|----------|-----------|-------------|------------
`align`| One-way | Write-only | String | Used to determine the render direction of the slider. Value can be 'horizontal', or 'vertical'.
`min`| One-way | Write-only | Number | Used set the minimum value of the slider.
`max`| One-way | Write-only | Number | Used set the maximum value of the slider.
`step`| One-way | Write-only | Number | Value change of each step of the slider.
`value`| Two-way | Read & Write | Number | Used get the value of the slider.


### Time Picker

Widget for selecting a time.

e.g.
```html
<time-picker [(time)]="start_date" ></calendar>
```

![Image of Calendar Time picker](https://cloud.githubusercontent.com/assets/20103948/17283853/7dd982e8-57f8-11e6-92b1-f688a2ee0fd2.png)

Time Pickers have 3 attributes.

Name | Bindings | Direction | Types | Description
-----|----------|-----------|-------------|------------
`time`      | Two-way | Write-only | Object | Used to get and set the time value of the selected date. i.e. time object is `{ h: Number, m: Number }`
`minuteStep`| One-way | Write-only | Number | Sets number of minutes the added or removed when minutes is changed.
`enter`		| One-way | Read-only  | time   | Called when the user pressed enter on the minutes field


### Toggle Buttons

Widgets for representing and changing binary values.

```html
<fancy-toggle type="text" [(state)]="active"></fancy-toggle>
```

The following attributes are common for all fancy toggle buttons.

Name | Bindings | Direction | Types | Description
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

Name | Bindings | Direction | Types | Description
-----|----------|-----------|-------------|------------
`active`| One-way | Write-only | String | Used to define the text displayed inside the toggle when it is in an active state.
`inactive`| One-way | Write-only | String | Used to define the text displayed inside the toggle when it is in an inactive state.

#### Toggle - Image

![Image Toggle](https://cloud.githubusercontent.com/assets/20103948/22870871/bc88c5ac-f1ff-11e6-80fa-ebe3e00c4490.png)

Widget that shows the binary state using images

e.g.
```html
<fancy-toggle type="image" [(state)]="value" inactive="/img/off_img.png" active="/img/on_img.png"></fancy-toggle>
```

A Image Toggle has 2 other attributes.

Name | Bindings | Direction | Types | Description
-----|----------|-----------|-------------|------------
`active`| One-way | Write-only | String | Used to define the image file used for the toggle when it is in an active state.
`inactive`| One-way | Write-only | String | Used to define the image file used for the toggle when it is in an inactive state.

#### Toggle - Icon

![Image of Icon Toggle](https://cloud.githubusercontent.com/assets/20103948/17200835/e62640e6-54cb-11e6-9417-16eaafe6a512.png)

Widget that shows the binary state using icons

e.g.
```html
<fancy-toggle type="image" [(state)]="value" inactive="fa fa-times" active="fa fa-tick"></fancy-toggle>
```

A Image Toggle has 3 other attributes.

Name | Bindings | Direction | Types | Description
-----|----------|-----------|-------------|------------
`active`| One-way | Write-only | String | Used to define the icon css classes used for the toggle when it is in an active state.
`inactive`| One-way | Write-only | String | Used to define the icon css classes used for the toggle when it is in an inactive state.
`shape`| One-way | Write-only | String | Used to define the shape of the bound box of the toggle. Value can be `circle` or `square`

#### Toggle - iOS

![Image of iOS Toggle](https://cloud.githubusercontent.com/assets/20103948/17200837/e66d32ee-54cb-11e6-94ce-c38d6cfe0eb2.png)

Widget that shows the binary state in the same way as toggles on iOS devices

e.g.
```html
<fancy-toggle type="ios" [(state)]="value" inactive="Off" active="On"></fancy-toggle>
```

A iOS Toggle has no other attributes that can be set.


### Typeaheads

Widget for displaying a list of selectable items that can be filtered.

![Typeahead](https://cloud.githubusercontent.com/assets/20103948/22871508/90a38188-f205-11e6-8095-0786de6d17f7.png)

```html
<div typeahead [filter]="search_input" [filterFields]="['name', 'location']" [list]="people" [msg]="'No people found'" (selected)="useItem($event)"></div>
```

Typeaheads have 9 attributes.

Name | Binding | Direction | Types | Description
-----|----------|-----------|-------------|------------
`filter`| One-way | Write-only | String | Value to filter the list of items by
`filterFields`| One-way | Write-only | String Array | List of fields to look for the filter value on each item
`list`| One-way | Write-only | Any Array | List of items to display in the typeahead
`show`| One-way | Write-only | Boolean | Shows the typeahead
`results`| One-way | Write-only | String | Maximum number of results to display
`auto`| One-way | Write-only | String | Automatically position typeahead above or below the attached element
`forceTop`| One-way | Write-only | String | Force typeahead to be displayed above the attached element
`msg`| One-way | Write-only | String | Message displayed when no items remain after filtering
`selected`| One-way | Read-only | Any | Called when item from list is selected, returns the item selected
