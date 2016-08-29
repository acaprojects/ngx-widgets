// Import all directives
import { Button, 
		 ButtonGroup, 
		 ButtonToggle, 
		 Calendar, 
		 DataInput,
		 Dropdown,
		 GlobalStyles,
		 InteractiveMap,
		 ModalDirective, 
		 NotificationDirective,
		 Slider, 
		 Spinner, 
		 TABS_DIRECTIVES,
		 TimePicker,  
		 Toggle,    
		 Typeahead } from './components/index';

// Export all directives
export * from './components/index';

// Export convenience property
export const ACA_WIDGET_COMPONENTS: any[] = [
	Button, 
	ButtonGroup, 
	ButtonToggle, 
	Calendar, 
	DataInput,
	Dropdown,
	GlobalStyles,
	InteractiveMap,
	ModalDirective, 
	NotificationDirective,
	Slider, 
	Spinner, 
	...TABS_DIRECTIVES,
	TimePicker,  
	Toggle,    
	Typeahead
];
