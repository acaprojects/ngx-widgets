// Import all directives
import { ButtonGroup } from './components/btn-group';
import { ButtonToggle } from './components/btn-toggle';
import { TABS_DIRECTIVES } from './components/tab-group';
import { Slider } from './components/slider';
import { FancyToggle } from './components/fancy-toggle';
import { InteractiveMap } from './components/interactive-map';
import { Calendar } from './components/calendar';
import { ModalDirective } from './components/modal';
import { NotificationDirective } from './components/notification';

// Export all directives
export * from './components/btn-group';
export * from './components/btn-toggle';
export * from './components/fancy-toggle';
export * from './components/slider';
export * from './components/tab-group';
export * from './components/interactive-map';
export * from './components/calendar';
export * from './components/modal';
export * from './components/notification';

// Export convenience property
export const ACA_WIDGET_COMPONENTS: any[] = [
    ButtonGroup,
    ButtonToggle,
    TABS_DIRECTIVES,
    Slider,
    FancyToggle,
    Calendar,
    ModalDirective,
    NotificationDirective,
    InteractiveMap
];
