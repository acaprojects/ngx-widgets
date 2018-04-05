
import { AppShellComponent } from './shell.component';
import { GENERAL_WIDGETS_SHOWCASE_COMPONENTS } from './general-widgets';
import { FORM_CONTROL_WIDGETS_SHOWCASE_COMPONENTS } from './form-control-widgets';
import { PAGE_CONTROL_WIDGETS_SHOWCASE_COMPONENTS } from './page-control-widgets';
import { WIDGET_DIRECTIVES_SHOWCASE_COMPONENTS } from './widget-directives';
import { WIDGET_PIPES_SHOWCASE_COMPONENTS } from './widget-pipes';
import { WIDGET_SERVICES_SHOWCASE_COMPONENTS } from './widget-services';

export * from './shell.component';

export const APP_COMPONENTS: any[] = [
    AppShellComponent,
    ...GENERAL_WIDGETS_SHOWCASE_COMPONENTS,
    ...FORM_CONTROL_WIDGETS_SHOWCASE_COMPONENTS,
    ...PAGE_CONTROL_WIDGETS_SHOWCASE_COMPONENTS,
    ...WIDGET_DIRECTIVES_SHOWCASE_COMPONENTS,
    ...WIDGET_PIPES_SHOWCASE_COMPONENTS,
    ...WIDGET_SERVICES_SHOWCASE_COMPONENTS
];
