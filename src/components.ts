// Import all directives
import { Button,
		 ButtonGroup,
		 ButtonToggle,
		 Calendar,
		 DataInput,
		 Dropdown,
		 DropTarget,
		 FileStream,
		 GlobalStyles,
		 ImageCrop,
		 InteractiveMap,
		 Modal,
		 ModalDirective,
		 Notification,
		 NotificationDirective,
		 OldDropdown,
		 Slider,
		 Spinner,
		 TABS_DIRECTIVES,
		 TimePicker,
		 Toggle,
		 Typeahead,
	 	 TypeaheadList } from './components/index';

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
 	DropTarget,
 	FileStream,
	GlobalStyles,
	ImageCrop,
	InteractiveMap,
	ModalDirective,
	NotificationDirective,
	OldDropdown,
	Slider,
	Spinner,
	...TABS_DIRECTIVES,
	TimePicker,
	Toggle,
	Typeahead
];

export const ACA_ENTRY_COMPONENTS: any[] = [
	Modal,
	Notification,
	TypeaheadList
]
