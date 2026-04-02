import type { AppSnackbar } from '@app/elements/snackbar/app-snackbar.element'
import { html, render } from 'lit'
import { when } from 'lit/directives/when.js'

export type NotificationVariant = 'default' | 'primary' | 'success' | 'warning' | 'error'

export interface NotifyOptions {
	message: string
	variant?: NotificationVariant
	icon?: string | boolean
	duration?: number
	action?: {
		label: string
		onAction?: (event: Event) => void
	}
}

const DEFAULT_ICON_MAP: Record<NotificationVariant, string> = {
	default: 'info',
	primary: 'info',
	success: 'check_circle',
	warning: 'warning',
	error: 'error',
}

export const notify = async (notification: NotifyOptions) => {
	await Promise.all([
		import('@app/elements/snackbar/app-snackbar.element'),
		import('@app/elements/icon/app-icon.element'),
		import('@app/elements/button/app-button.element'),
	])

	const { message, variant = 'default', duration = 3000, icon = true, action } = notification

	// Remove existing Snackbar
	document.querySelector<AppSnackbar>('app-snackbar#snackbar')?.remove()

	// Create Snackbar
	const snackbar = Object.assign(document.createElement('app-snackbar'), { id: 'snackbar', variant, duration, action: action?.label })
	snackbar.addEventListener('app-after-hide', () => snackbar?.remove(), { once: true })

	if (action?.onAction) {
		snackbar.addEventListener('app-snackbar-action', (e) => action.onAction?.(e))
	}

	// Set up state
	const iconName = typeof icon === 'string' ? icon : DEFAULT_ICON_MAP[variant]
	const template = html` ${when(icon, () => html`<app-icon slot="icon" filled>${iconName}</app-icon>`)} ${message} `

	// Render
  render(template, snackbar)

  // Add to DOM
	document.body.appendChild(snackbar)

	// show
	snackbar.show()

	return snackbar
}
