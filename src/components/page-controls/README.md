
### Tab Group

![Image of Tab Group](https://cloud.githubusercontent.com/assets/20103948/17200834/e620bebe-54cb-11e6-912c-a1d6ed4717dc.png)

Import `import { TABS_DIRECTIVES } from '@aca-1/a2-widgets';`

To use a tab group in your component for import the TABS_DIRECTIVES into your component.

Then you can use insert a tab-group tag into you html when you want the element to appear.

e.g.
```html
<tab-group [(state)]="tab_value" routable="route" routeParam="tab">
    <tab-head id="0">Title of Tab</tab-head>
    <tab-body id="0">Content of Tab</tab-body>
</tab-group>
```

A TabGroup has 3 attributes.

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
