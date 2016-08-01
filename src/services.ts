// Import all services
import { ModalService } from './components/modal';
import { NotificationService } from './components/notification';
// Export all services

// Export convenience property
export const ACA_WIDGET_PROVIDERS: any[] = [
	ModalService, 
	NotificationService
];
