// Import all services
import { ModalService } from './components/modal';
import { NotificationService } from './components/notification';
import { ACA_Animate } from './services/animate.service';
import { MapService } from './components/interactive-map';
import { DropService } from './components/file-drop';
import { DynamicTypeBuilder } from './components/dynamic/type.builder';

// Export all services
export * from './components/modal';
export * from './components/notification';
export * from './services';

// Export convenience property
export const ACA_WIDGET_PROVIDERS: any[] = [
	ACA_Animate,
	DropService,
	DynamicTypeBuilder,
	MapService,
	ModalService, 
	NotificationService
];
