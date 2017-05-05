    // Dialog Boxes

import { AlertDialog } from './alert-dialog';
import { ConfirmDialog } from './confirm-dialog';
import { DateDialog } from './date-dialog';

    // Other modals
import { SimpleModal } from './simple-modal';
import { TimeDialog } from './time-dialog';

export * from './alert-dialog';
export * from './confirm-dialog';
export * from './date-dialog';
export * from './time-dialog';

export * from './simple-modal';

export const ACA_WIDGET_MODALS = [

    AlertDialog,
    ConfirmDialog,
    DateDialog,
    TimeDialog,

    SimpleModal,
];
