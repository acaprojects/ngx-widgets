// Import all directives
import { ButtonGroup } from './components/btn-group';
import { ButtonToggle } from './components/btn-toggle';
import { TABS_DIRECTIVES } from './components/tab-group';
import { Slider } from './components/slider';
import { FancyToggle } from './components/fancy-toggle';

// Export all directives
export * from './components/btn-group';
export * from './components/btn-toggle';
export * from './components/fancy-toggle';
export * from './components/slider';
export * from './components/tab-group';

// Export convenience property
export const ACA_WIDGET_COMPONENTS: any[] = [
    ButtonGroup,
    ButtonToggle,
    TABS_DIRECTIVES,
    Slider,
    FancyToggle
];
