
# Angular 2 - Widgets

## [Component Documentation](../README.md)

## Buttons Listing
- Buttons
- Button Groups
- Button Toggles

### Button

A simple button based on Google's Material Design Guidelines

e.g.
```
<btn type="submit" btnType="raised" color="pink" primary="C700" secondary="A700" (onClick)="doSomething()"></btn>
```

Buttons have 8 attributes.

![Image of Buttons](https://cloud.githubusercontent.com/assets/20103948/17200830/e6144846-54cb-11e6-9c1a-214a15f5f7ad.png)

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`color`| One-way | Write-only | String | Colour of the button e.g. blue. Available colours -> [Material Design - Color](https://material.io/guidelines/style/color)
`primary`| One-way | Write-only | String | Idle colour e.g. C500. Available colours -> [Material Design - Color](https://material.io/guidelines/style/color)
`secondary`| One-way | Write-only | String | Hover colour e.g. A200. Available colours -> [Material Design - Color](https://material.io/guidelines/style/color)
`type` | One-way | Write-only | String | HTML button type e.g. submit
`btnType` | One-way | Write-only | String | Type of button to display. Values: raised, flat, action, mini-action 
`styles` | One-way | Write-only | Object | CSS Styles to apply to the button element
`disabled` | One-way | Write-only | Boolean | Disables use of the button
`onClick` | One-way | Read-only | Event | Called when tap/click event occurs on button when not disabled

### Button Toggle

A simple button for toggling.

e.g.
```html
<btn-toggle active="Active" inactive="Inactive" [(value)]="value"></btn-toggle>
```

Button Toggles have 3 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`active`| One-way | Write-only | String | Used to define the text displayed inside the button when it is in an active state.
`inactive`| One-way | Write-only | String | Used to define the text displayed inside the button when it is in an inactive state.
`value`| Two-way | Read & Write | Boolean | Used to get and set the state of the button

### Button Groups

A group of button toggles

![Image of Button Group](https://cloud.githubusercontent.com/assets/20103948/17200830/e6144846-54cb-11e6-9c1a-214a15f5f7ad.png)

e.g.
```html
<btn-group [items]="['One', 'Two', 'Three', 'Four']" [(selected)]="value"></btn-group>
```

Button Groups have 2 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`items`| One-way | Write-only | String Array | Used to define the text displayed on each of the buttons.
`selected`| Two-way | Read & Write | Integer | Used to get and set the index of the button that is selected within the group.
