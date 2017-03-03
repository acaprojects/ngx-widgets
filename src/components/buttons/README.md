
# Angular 2 - Widgets

## [Component Documentation](../README.md)

## Buttons Listing
- Buttons
- Button Groups
- Button Toggles

### Button

Widget for simple buttons based on Google's Material Design Guidelines

![Buttons](https://cloud.githubusercontent.com/assets/20103948/22870737/266593c6-f1fe-11e6-8ec1-9015a817cae1.png)

e.g.
```html
<btn type="submit" btnType="raised" color="pink" primary="C700" secondary="A700" (onClick)="doSomething()"></btn>
```

Buttons have 8 attributes.

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

Widget for simple toggle buttons

![image](https://cloud.githubusercontent.com/assets/20103948/23540024/ee9c757a-0032-11e7-92db-a8c44341c28f.png)

e.g.
```html
<btn-toggle active="Active" inactive="Inactive" [(value)]="value"></btn-toggle>
```

Button Toggles have 8 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`model`| Two-way | Read & Write | Boolean | Used to get and set the state of the button
`color`| One-way | Write-only | String | Colour of the button e.g. blue. Available colours -> [Material Design - Color](https://material.io/guidelines/style/color)
`primary`| One-way | Write-only | String | Idle colour e.g. C500. Available colours -> [Material Design - Color](https://material.io/guidelines/style/color)
`secondary`| One-way | Write-only | String | Hover colour e.g. A200. Available colours -> [Material Design - Color](https://material.io/guidelines/style/color)
`type` | One-way | Write-only | String | HTML button type e.g. submit
`btnType` | One-way | Write-only | String | Type of button to display. Values: raised, flat, action, mini-action 
`styles` | One-way | Write-only | Object | CSS Styles to apply to the button element
`disabled` | One-way | Write-only | Boolean | Disables use of the button

### Button Groups

A group of button toggles

![Button Group](https://cloud.githubusercontent.com/assets/20103948/23539975/99ec27f0-0032-11e7-9ec3-33b45fa2c6a6.png)


e.g.
```html
<btn-group [items]="['One', 'Two', 'Three', 'Four']" [(selected)]="value"></btn-group>
```

Button Groups have 8 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`items`| One-way | Write-only | String Array | Used to define the text displayed on each of the buttons.
`model`| Two-way | Read & Write | Integer | Used to get and set the index of the button that is selected within the group.
`color`| One-way | Write-only | String | Colour of the button e.g. blue. Available colours -> [Material Design - Color](https://material.io/guidelines/style/color)
`primary`| One-way | Write-only | String | Idle colour e.g. C500. Available colours -> [Material Design - Color](https://material.io/guidelines/style/color)
`secondary`| One-way | Write-only | String | Hover colour e.g. A200. Available colours -> [Material Design - Color](https://material.io/guidelines/style/color)
`type` | One-way | Write-only | String | HTML button type e.g. submit
`btnType` | One-way | Write-only | String | Type of button to display. Values: raised, flat, action, mini-action 
`styles` | One-way | Write-only | Object | CSS Styles to apply to the button element
`disabled` | One-way | Write-only | Boolean | Disables use of the button
