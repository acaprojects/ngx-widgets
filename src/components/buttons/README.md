
### Button Toggle

A simple button for toggling.

Import `import { ButtonToggle } from '@aca-1/a2-widgets';`

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

Import `import { ButtonGroup } from '@aca-1/a2-widgets';`

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
