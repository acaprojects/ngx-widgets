// Import all directives
import { Button } from './components/btn';
import { ButtonGroup } from './components/btn-group';
import { ButtonToggle } from './components/btn-toggle';
import { TABS_DIRECTIVES } from './components/tab-group';
import { Slider } from './components/slider';
import { Spinner } from './components/spinner';
import { FancyToggle } from './components/fancy-toggle';
import { GlobalStyles } from './components/global-styles';
import { InteractiveMap } from './components/interactive-map';
import { Calendar } from './components/calendar';
import { ModalDirective } from './components/modal';
import { NotificationDirective } from './components/notification';
import { TimePicker } from './components/time-picker';
import { Dropdown } from './components/dropdown';
import { Typeahead } from './components/typeahead';

// Export all directives
export * from './components/btn';
export * from './components/btn-group';
export * from './components/btn-toggle';
export * from './components/typeahead';
export * from './components/fancy-toggle';
export * from './components/global-styles';
export * from './components/slider';
export * from './components/spinner';
export * from './components/tab-group';
export * from './components/interactive-map';
export * from './components/calendar';
export * from './components/modal';
export * from './components/notification';
export * from './components/time-picker';
export * from './components/dropdown';

// Export convenience property
export const ACA_WIDGET_COMPONENTS: any[] = [
	Button,
    ButtonGroup,
    ButtonToggle,
    ...TABS_DIRECTIVES,
    Slider,
    FancyToggle,
    GlobalStyles,
    Calendar,
    ModalDirective,
    NotificationDirective,
    InteractiveMap,
    Spinner,
    TimePicker,
    Dropdown,
    Typeahead
];
