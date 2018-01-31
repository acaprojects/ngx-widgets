
import { AppShellComponent } from './shell.component';
import { GENERAL_WIDGETS_SHOWCASE_COMPONENTS } from './general-widgets';

export * from './shell.component';

export const APP_COMPONENTS: any[] = [
    AppShellComponent,
    ...GENERAL_WIDGETS_SHOWCASE_COMPONENTS
];
