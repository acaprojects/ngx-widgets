
# Angular 2 - Widgets

## [Component Documentation](../README.md)

- Page Controls
 - Stepper
 - Tab Group

### Stepper

:TODO Write description

![Stepper](https://cloud.githubusercontent.com/assets/20103948/22871747/eb2c5f2e-f207-11e6-849d-ec95e8306c5c.png)

```html
<stepper>
	<step title="Steppa 1"></step>
	<step title="Another Step"></step>
</stepper>
```

Steppers have 7 attributes.

Name | Binding | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`id`| One-way | Write-only | String | Stream ID to look for an file on. Default: 'zero'

Stepper steps have 2 attributes.

Name | Binding | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`title`| One-way | Write-only | String | Name of the step to display

### Tab Group

![Tab Group](https://cloud.githubusercontent.com/assets/20103948/22871740/cfaf851e-f207-11e6-944d-fce7bb75d329.png)

e.g.
```html
<tab-group [(state)]="tab_value" routable="route" routeParam="tab">
    <tab-head id="0">Title of Tab</tab-head>
    <tab-body id="0">Content of Tab</tab-body>
</tab-group>
```

Tab Groups have 3 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`routable`| One-way | Write-only | String | Used to determine if the tabs read and write to the route of the application. Value can be 'route', 'query', or 'hash'.
`routeParam`| One-way | Write-only | String | Used to name the variable that is used in routing for the selection of tab.
`state`| Two-way | Read & Write | String | Used to get and set the id of the selected tab.

#### Tab Head

Inside tab groups the contents for the heading for each tab is defined within a tab-head tag

A TabHead has 1 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`id`| One-way | Write-only | String | Used to set identifier of the tab this is also used to refernce the TabBody that it matches with.

#### Tab Body

Inside tab groups the contents for the body for each tab is defined within a tab-body tag

A TabBody has 1 attributes.

Name | Bindings | Direction | Valid Types | Description
-----|----------|-----------|-------------|------------
`id`| One-way | Write-only | String | Used to set identifier of the tab this is also used to refernce the TabHead that it matches with.
