
import { Routes } from '@angular/router';
import { AppShellComponent } from './shell/shell.component';
import { GeneralWidgetsComponent } from './shell/general-widgets/general-widgets.component';
import { FormControlWidgetsComponent } from './shell/form-control-widgets/form-control-widgets.component';
import { PageControlWidgetsComponent } from './shell/page-control-widgets/page-control-widgets.component';
import { WidgetDirectivesComponent } from './shell/widget-directives/widget-directives.component';
import { WidgetPipesComponent } from './shell/widget-pipes/widget-pipes.component';
import { WidgetServicesComponent } from './shell/widget-services/widget-services.component';

export const ROUTES: Routes = [
    { path: '', component: AppShellComponent, children: [
        { path: '', component: GeneralWidgetsComponent },
        { path: 'general', component: GeneralWidgetsComponent },
        { path: 'general/:location', component: GeneralWidgetsComponent },
        { path: 'form-controls', component: FormControlWidgetsComponent },
        { path: 'form-controls/:location', component: FormControlWidgetsComponent },
        { path: 'page-controls', component: PageControlWidgetsComponent },
        { path: 'page-controls/:location', component: PageControlWidgetsComponent },
        { path: 'directives', component: WidgetDirectivesComponent },
        { path: 'directives/:location', component: WidgetDirectivesComponent },
        { path: 'pipes', component: WidgetPipesComponent },
        { path: 'pipes/:location', component: WidgetPipesComponent },
        { path: 'services', component: WidgetServicesComponent },
        { path: 'services/:location', component: WidgetServicesComponent }
    ]},
    { path: '**', redirectTo: '' },
];