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

	// Locate or create Snackbar
	let snackbar = document.querySelector<AppSnackbar & { actionHandler?: (event: Event) => void }>('app-snackbar#snackbar')

	if (!snackbar) {
		snackbar = document.createElement('app-snackbar')
		snackbar.id = 'snackbar'
		snackbar.addEventListener('app-after-hide', () => snackbar?.remove())
		document.body.appendChild(snackbar)
	}

	// Cleanup previous action listener to prevent multiple triggers
	if (snackbar.actionHandler) {
		snackbar.removeEventListener('app-snackbar-action', snackbar.actionHandler)
	}

	// Set up new state
	const iconName = typeof icon === 'string' ? icon : DEFAULT_ICON_MAP[variant]
	const template = html` ${when(icon, () => html`<app-icon slot="icon" filled>${iconName}</app-icon>`)} ${message} `

	const actionHandler = (event: Event) => action?.onAction?.(event)
	snackbar.actionHandler = actionHandler
	snackbar.addEventListener('app-snackbar-action', actionHandler)
	Object.assign(snackbar, { variant, duration, action: action?.label, actionHandler })

	// render
	render(template, snackbar)

	// show
	snackbar.show()

	return snackbar
}
