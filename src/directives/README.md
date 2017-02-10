
# Angular 2 - Widgets

## [Source Documentation](../README.md)

## Directive Listing
- Drop Target
- File Stream
- Modal
- Notification
- Virtual Keyboard

### Drop Target

Turns an element into a file drop point

```html
<div drop-target stream="avatar" indicate="hover">
```

Drop Targets have 3 attributes.

Name      | Bindings | Direction   | Valid Types | Description
----------|----------|-------------|-------------|------------
`target`  | One-way  | Write-only  | String   | ID of element to set as drop zone. Defaults to attached element.
`stream`  | One-way  | Write-only  | String   | Name of the stream the files should be sent to
`indicate`| One-way  | Write-only  | Boolean  | Defines the hover class to apply, defaults to: drop-indicate

### File Stream

Turns an element into a file drop point

```html
<input type="file" file-stream stream="avatar">
```

Drop Targets have 3 attributes.

Name      | Bindings | Direction   | Valid Types | Description
----------|----------|-------------|-------------|------------
`stream`  | One-way  | Write-only  | String   | Name of the stream the files should be sent to

### Modal

Needs to be reworked. Use modal service instead.

### Notification

Directive to create a notification when the parent element becomes part of the DOM

e.g.
```html
<div notification message="The world is ending... now!" [(value)]="value"></btn-toggle>
```

Notifications have 3 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`message` | One-way | Write-only | String  | Used to define the text displayed inside the notification, can be html.
`cssClass`| One-way | Write-only | String  | Used to define any css class that will be applied to the created notification
`options` | One-way | Write-only | Object  | Used to define options for the notification. `timeout`, `canClose` and `styles` can be set. `timeout` defined the time in ms the notification will close if `canClose` is false. `canClose` defines is the user can close the notification. `styles` is use to define custom styles for the notification.

### Virtual Keyboard

TODO