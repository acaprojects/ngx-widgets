# Angular 2 Widgets

## Usage

Import the desired widget into your component.

### Button Toggle

Import `import { ButtonToggle } from '@aca/a2-widgets';`

To use a Button Toggle in your component for import the ButtonToggle directive into your component.

Then you can use insert a btn-toggle tag into you html when you want the element to appear.

e.g. `<btn-toggle active="Active" inactive="Inactive" [(value)]="value"></btn-toggle>`

A Button Toggle has 3 attributes that can be set.

* `active` is used to define the text displayed inside the button when it is in an active state.
* `inactive` is used to define the text displayed inside the button when it is in an inactive state.
* `value` is used to get and set the state of the button.

`active` & `inactive` are one-way bindings.
`value` is two-way bound.

### Button Groups

Import `import { ButtonGroup } from '@aca/a2-widgets';`

To use a button group in your component for import the ButtonGroup directive into your component.

Then you can use insert a btn-group tag into you html when you want the element to appear.

e.g. `<btn-group [items]="['One', 'Two', 'Three', 'Four']" [(selected)]="value"></btn-group>

A Button Group has 2 attributes that can be set.

* `items` is an array used to define the text displayed on each of the buttons.
* `selected` is used to get and set the index of the button that is selected within the group.

`items` is one-way bindings.
`selected` is two-way bound.

### Toggle Buttons

Import `import { FancyToggle } from '@aca/a2-widgets';`

To use a fancy toggle button in your component for import the FancyToggle directive into your component.

Then you can use insert a fancy-toggle tag into you html when you want the element to appear.

The following attributes are common for all fancy toggle buttons.

* `type` attribute is used to select the type of toggle button that you wish to use.
** The value of `type` can be 'text', 'image', 'icon', and 'ios'.
* `state` is used to get and set the state of the button.

`type` is one-way bound.
`state` is two-way bound.

#### Text Toggle

Creates a toggle switch that display text inside the toggle space.

e.g. `<fancy-toggle type="text" [(state)]="value" inactive="Off" active="On"></fancy-toggle>`

A Text Toggle has 2 extra attributes that can be set.

* `active` is used to define the text displayed inside the toggle when it is in an active state.
* `inactive` is used to define the text displayed inside the toggle when it is in an inactive state.

`inactive` & `active` are one-way bindings.

#### Image Toggle

Creates a toggle switch that displays an image based off of the state of the toggle

e.g. `<fancy-toggle type="image" [(state)]="value" inactive="/img/off_img.png" active="/img/on_img.png"></fancy-toggle>`

A Image Toggle has 2 extra attributes that can be set.

* `active` is used to define the image displayed when the toggle it is in an active state.
* `inactive` is used to define the image displayed when the toggle it is in an inactive state.

`inactive` & `active` are one-way bindings.

#### Icon Toggle

Creates a toggle switch that displays an image based off of the state of the toggle

e.g. `<fancy-toggle type="image" [(state)]="value" inactive="/img/off_img.png" active="/img/on_img.png"></fancy-toggle>`

A Image Toggle has 3 extra attributes that can be set.

* `active` is used to define the image displayed when the toggle it is in an active state.
* `inactive` is used to define the image displayed when the toggle it is in an inactive state.
* `shape` is used to define the shape of the bound box of the toggle.

`inactive`, `active` & `shape` are one-way bindings.

#### iOS Toggle

Creates a simple toggle switch that looks like the toggles used in iOS.

e.g. `<fancy-toggle type="ios" [(state)]="value" inactive="Off" active="On"></fancy-toggle>`

A iOS Toggle has no extra attributes that can be set.

### Slider

Import `import { Slider } from '@aca/a2-widgets';`

### Tab Group

Import `import { TABS_DIRECTIVES } from '@aca/a2-widgets';`

## License

MIT © [Alex Sorafumo](alex@yuion.net)
