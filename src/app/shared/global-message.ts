import { escapeHtml } from '@app/utils/html'

/**
 * Show global message
 * @param message
 * @param type
 */
export const globalMessage = async (message: string, type: 'info' | 'warning' | 'error' = 'info') => {
	await import('@app/elements/global-message/app-global-message.element')

	let element = document.querySelector('app-global-message')

	// If exist update else create
	if (element) {
		Object.assign(element, {
			type,
			innerHTML: `${escapeHtml(message)}`,
		})
	} else {
		element = Object.assign(document.createElement('app-global-message'), {
			type,
			innerHTML: `${escapeHtml(message)}`,
		})
		document.body.appendChild(element)
	}

	// Remove from DOM after hide animation finishes
	element.addEventListener('app-after-hide', () => element.remove())

	element.show()
}
