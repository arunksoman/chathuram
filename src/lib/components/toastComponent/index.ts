import { toastStore as toast } from './toastStore.js';
import type { ToastType } from './toastStore.js';

export { default as Toast } from './toast.svelte';
export { default as ToastProvider } from './ToastProvider.svelte';
export { toastStore } from './toastStore.js';
export type { ToastType, Toast as ToastItem, ToastOptions } from './toastStore.js';

// Helper function for easier usage
export const showToast = (options: { type: ToastType; message: string; description?: string }) => {
	const fullMessage = options.description 
		? `${options.message}: ${options.description}`
		: options.message;
	toast.show(fullMessage, { type: options.type });
};
