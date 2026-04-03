import type { AppGlobalMessage } from '@app/elements/global-message/app-global-message.element'
import { html, render } from 'lit'

/**
 * Show global message
 * @param message
 * @param type
 */
export const globalMessage = async (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
	await import('@app/elements/global-message/app-global-message.element')

	// Hide existing GlobalMessage
	document.querySelector<AppGlobalMessage>('app-global-message#global-message')?.remove()

	// Create GlobalMessage
	const globalMessage = Object.assign(document.createElement('app-global-message'), { id: 'global-message', level })
	globalMessage.addEventListener('app-after-hide', () => globalMessage?.remove())

	// Set up state
	const template = html`${message}`

	// Render
  render(template, globalMessage)

  // Add to DOM
	document.body.appendChild(globalMessage)

	return globalMessage.show()
}
