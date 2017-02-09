
# Angular 2 - Widgets

## [Source Documentation](../README.md)

## Service Listing
- [File Drop](### File Drop)
- [Animate](### Animate)
- [Maps](### Maps)
- [Modal](### Modals)
- [Notification](### Notifications)

### Modals

#### Setup

Modal Service must be initialised in the root component by setting the `view` property with a ViewContainerRef.

e.g.
```javascript

import { Component, ViewContainerRef } from '@angular/core';
import { ModalService } from '@aca-1/a2-widgets';

@Component({
  selector: 'app',
  styleUrls: [...]
  template: ...
})
export class App {
  constructor(view: ViewContainerRef, private modal: ModalService) {
    modal.view = view;
  }
}

```

#### Service

Modals can also be added via code using the `ModalService`.

##### Functions

```javascript
	setup(id: String, attr: Object);
```
###### Setup Function
* No return value.
* Function sets up the properties for the modal with the given id
* attr can set all the writable attributes defined in the modal directive above

```javascript
	open(id: String, attr?: Object);
```
###### Open Function
* No return value.
* Function sets up the properties for the modal with the given id
* attr can set all the writable attributes defined in the modal directive above

```javascript
	close(id: String);
```
###### Close Function
* No return value.
* Function closes a modal with the given id.

```javascript
	clear();
```
###### Clear Function
* No return value.
* Function closes all modals open.

### Notifications

#### Setup

Notifications Service must be initialised in the root component by setting the `view` property with a ViewContainerRef.

e.g.
```javascript

import { Component, ViewContainerRef } from '@angular/core';
import { NotificationService } from '@aca-1/a2-widgets';

@Component({
  selector: 'app',
  styleUrls: [...]
  template: ...
})
export class App {
  constructor(view: ViewContainerRef, private notifications: NotificationService) {
    notifications.view = view;
  }
}

```
#### Usage

Notifications can also be added via code using the `NotificationService`.

##### Functions

```javascript
	add(message: String, cssClass?: String, options?: Object);
```
###### Open Function
* Returns the id value of the notification.
* Function opens a notification with the given `message` using the given `options`.
* `options` has 3 properties that can be set `timeout`, `canClose` and `styles`. `timeout` defined the time in ms the notification will close if `canClose` is false. `canClose` defines is the user can close the notification. `styles` is use to define custom styles for the notification.

```javascript
	close(id: String);
```
###### Close Function
* No return value.
* Function closes a notification with the given id.

```javascript
	clear();
```
###### Clear Function
* No return value.
* Function closes all open notifications.
