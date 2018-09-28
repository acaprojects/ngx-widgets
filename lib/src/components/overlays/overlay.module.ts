
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
import { DraggedItemOverlayComponent } from './dragged-item/dragged-item.component';
import { ContextItemComponent } from './context-item/context-item.component';

import { ModalDirective } from '../../directives/overlays/modal.directive';
import { NotifyDirective } from '../../directives/overlays/notify.directive';
import { TooltipDirective } from '../../directives/overlays/tooltip.directive';

import { WidgetsPipeModule } from '../../pipes/pipe.module';
import { DirectiveWidgetsModule } from '../../directives/directives.module';
import { ContextItemDirective } from '../../directives/context-item.directive';

const COMPONENTS: any[] = [
    DynamicBaseComponent,
    OverlayContentComponent,
    ModalComponent,
    NotificationComponent,
    OverlayContainerComponent,
    TooltipComponent,
    ContextItemComponent
];

const DIRECTIVES: any[] = [
    ModalDirective,
    NotifyDirective,
    TooltipDirective,
    ContextItemDirective
];

@NgModule({
    declarations: [
        /* COMPONENTS */
        ...COMPONENTS,
        DraggedItemOverlayComponent,
        /* DIRECTIVES */
        ...DIRECTIVES
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        WidgetsPipeModule,
        DirectiveWidgetsModule
    ],
    exports: [
        /* COMPONENTS */
        ...COMPONENTS,
        /* DIRECTIVES */
        ...DIRECTIVES
    ],
    entryComponents: [
        ...COMPONENTS,
        DraggedItemOverlayComponent
    ]
})
export class OverlayWidgetsModule {

}

export const ACA_OVERLAY_WIDGETS_MODULE = OverlayWidgetsModule;
