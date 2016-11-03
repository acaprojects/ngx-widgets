import { ModalDirective } from './modal.directive';
import { NotificationDirective } from './notification.directive';
import { DropTarget } from './drop-target.directive';
import { FileStream } from './file-stream.directive';
import { VirtualKeyboardDirective } from './virtual-keyboard.directive';

export * from './modal.directive';
export * from './notification.directive';
export * from './drop-target.directive';
export * from './file-stream.directive';
export * from './virtual-keyboard.directive';

export let DIRECTIVES: any[] = [
    ModalDirective,
    NotificationDirective,
    DropTarget,
    FileStream,
    VirtualKeyboardDirective
];
