
import { Routes } from '@angular/router';
import { AppShellComponent } from './shell/shell.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: AppShellComponent,
        children: [
        ]
    },
    { path: '**', redirectTo: '' },
];