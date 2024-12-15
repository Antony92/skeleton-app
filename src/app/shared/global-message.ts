import { AppGlobalMessage } from '@app/elements/global-message/app-global-message.element'
import { html, render } from 'lit'

/**
 * Show global message
 * @param message
 * @param type
 */
export const globalMessage = async (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
	await import('@app/elements/global-message/app-global-message.element')

	let globalMessage = document.querySelector<AppGlobalMessage>('app-global-message#global-message')

	const template = html`${message}`

	// If exist update else create
	if (globalMessage) {
		Object.assign(globalMessage, { level })
		render(template, globalMessage)
	} else {
		globalMessage = Object.assign(document.createElement('app-global-message'), {
			id: 'global-message',
			level,
		})
		render(template, globalMessage)
		document.body.appendChild(globalMessage)
	}

	// Remove from DOM after hide animation finishes
	globalMessage.addEventListener('app-after-hide', () => globalMessage.remove())

	return globalMessage.show()
}
