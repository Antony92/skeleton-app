import type { AppGlobalMessage } from '@app/elements/global-message/app-global-message.element'
import { html, render } from 'lit'

/**
 * Show global message
 * @param message
 * @param type
 */
export const globalMessage = async (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
	await import('@app/elements/global-message/app-global-message.element')

	// Locate or create GlobalMessage
	let globalMessage = document.querySelector<AppGlobalMessage>('app-global-message#global-message')

	if (!globalMessage) {
		globalMessage = document.createElement('app-global-message')
		globalMessage.id = 'global-message'
		globalMessage.addEventListener('app-after-hide', () => globalMessage?.remove())
		document.body.appendChild(globalMessage)
	}

	// Set up new state
	const template = html`${message}`
	Object.assign(globalMessage, { level })

	// render
	render(template, globalMessage)

	return globalMessage.show()
}
