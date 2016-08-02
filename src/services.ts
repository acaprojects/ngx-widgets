// Import all services
import { ModalService } from './components/modal';
import { NotificationService } from './components/notification';
import { ACA_Animate } from './services';

// Export all services
export * from './components/modal';
export * from './components/notification';

// Export convenience property
export const ACA_WIDGET_PROVIDERS: any[] = [
	ModalService, 
	NotificationService,
	ACA_Animate
];
