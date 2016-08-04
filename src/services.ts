// Import all services
import { ModalService } from './components/modal';
import { NotificationService } from './components/notification';
import { ACA_Animate } from './services/animate.service';
import { MapService } from './components/interactive-map';

// Export all services
export * from './components/modal';
export * from './components/notification';
export * from './services';

// Export convenience property
export const ACA_WIDGET_PROVIDERS: any[] = [
	ModalService, 
	NotificationService,
	ACA_Animate,
	MapService
];
