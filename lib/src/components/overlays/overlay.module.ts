
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DynamicBaseComponent } from './dynamic-base.component';
import { OverlayContentComponent } from './overlay-content.component';
import { ModalComponent } from './modal/modal.component';
import { NotificationComponent } from './notification/notification.component';
import { OverlayContainerComponent } from './overlay-container/overlay-container.component';
import { TooltipComponent } from './tooltip/tooltip.component';

import { ModalDirective } from '../../directives/overlays/modal.directive';
import { NotifyDirective } from '../../directives/overlays/notify.directive';
import { TooltipDirective } from '../../directives/overlays/tooltip.directive';

import { WidgetsPipeModule } from '../../pipes/pipe.module';

@NgModule({
    declarations: [
        /* COMPONENTS */
        DynamicBaseComponent,
        OverlayContentComponent,
        ModalComponent,
        NotificationComponent,
        OverlayContainerComponent,
        TooltipComponent,
        /* DIRECTIVES */
        ModalDirective,
        NotifyDirective,
        TooltipDirective
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        WidgetsPipeModule
    ],
    exports: [
        /* COMPONENTS */
        DynamicBaseComponent,
        OverlayContentComponent,
        ModalComponent,
        NotificationComponent,
        OverlayContainerComponent,
        TooltipComponent,
        /* DIRECTIVES */
        ModalDirective,
        NotifyDirective,
        TooltipDirective
    ],
    entryComponents: [
        DynamicBaseComponent,
        OverlayContentComponent,
        ModalComponent,
        NotificationComponent,
        OverlayContainerComponent,
        TooltipComponent
    ]
})
export class OverlayWidgetsModule {

}

export const ACA_OVERLAY_WIDGETS_MODULE = OverlayWidgetsModule;
