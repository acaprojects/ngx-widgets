
# Angular 2 - Widgets

## [Source Documentation](../README.md)

## Directive Listing
- [Drop Targets]()
- [File Streams]()
- [Modals]()
- [Notifications]()
- [Virtual Keyboards]()


### Modal

Directive to open a modal with a binding

e.g.
```html
<div modal [title]="'ModalTest'" [id]="'a modal'" [close]="true" [html]="html" [data]="data" [size]="'small'" (ok)="done($event)"  (cancel)="failed($event)" [active]="true"></div>
```

Modal Directive has 3 attributes.

Name      | Bindings | Direction   | Valid Types | Description
----------|----------|-------------|-------------|------------
`title`   | One-way | Write-only   | String   | Used to define the text displayed inside the header of the modal.
`id`      | One-way | Write-only   | String   | Used to define the id of the modal. id is used by the modal service.
`close`   | One-way | Write-only   | Boolean  | Used to define whether or not the user can close the modal by clicking outside it.
`html`    | One-way | Write-only   | String   | Used to define the html contents of the modal.
`data`    | Two-way | Read & Write | Any      | Used to define data property used by the modal content.
`options` | One-way | Write-only   | Object[] | Used to define the buttons in the footer of the modal. Objects are structured like so: `{ text: String, fn: Function }`. Functions should have 2 arguments `data` and `callback`.
`size`    | One-way | Write-only   | String   | Used to define the size of the modal. Value can be 'small' or 'large'.
`styles`  | One-way | Write-only   | String   | Used to define the css styles of the modal content.
`active`  | One-way | Write-only   | Boolean  | Used to open modal.
`ok`      | One-way | Read-only    | N/A      | Called when the default 'ok' options is called.
`cancel`  | One-way | Read-only    | N/A      | Called when the default 'cancel' options is called.

Values in `data` can be bound to inside the html contents.

e.g.
```html
	<div>{{data.name}}</div>
```

### Notification

Directive to create a notification when the parent element becomes part of the DOM

e.g.
```html
<div notification message="The world is ending... now!" [(value)]="value"></btn-toggle>
```

A Notification Directive has 3 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`message` | One-way | Write-only | String  | Used to define the text displayed inside the notification, can be html.
`cssClass`| One-way | Write-only | String  | Used to define any css class that will be applied to the created notification
`options` | One-way | Write-only | Object  | Used to define options for the notification. `timeout`, `canClose` and `styles` can be set. `timeout` defined the time in ms the notification will close if `canClose` is false. `canClose` defines is the user can close the notification. `styles` is use to define custom styles for the notification.
