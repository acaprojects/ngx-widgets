
import { Routes } from '@angular/router';
import { AppShellComponent } from './shell/shell.component';
import { GeneralWidgetsComponent } from './shell/general-widgets/general-widgets.component';

export const ROUTES: Routes = [
    { path: '', component: AppShellComponent, children: [
        { path: '', component: GeneralWidgetsComponent }
    ]},
    { path: '**', redirectTo: '' },
];