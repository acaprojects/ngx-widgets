
import { ModalDirective } from './modal.directive';
import { NotifyDirective } from './notify.directive';
import { TooltipDirective } from './tooltip.directive';

export * from './modal.directive';
export * from './notify.directive';
export * from './tooltip.directive';

export const OVERLAY_DIRECTIVES: any[] = [
    ModalDirective,
    NotifyDirective,
    TooltipDirective,
];
