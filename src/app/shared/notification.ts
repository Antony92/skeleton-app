import { AppSnackbar } from '@app/elements/snackbar/app-snackbar.element'
import { html, render } from 'lit'
import { when } from 'lit/directives/when.js'

export const notify = async (notification: {
	message: string
	variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
	icon?: string | boolean
	duration?: number
}) => {
	await import('@app/elements/snackbar/app-snackbar.element')
	await import('@app/elements/icon/app-icon.element')

	const { message, variant = 'default', duration = 3000 } = notification

	let icon = notification.icon || false

	const defaultIconMap = {
		default: 'circle-info',
		primary: 'circle-info',
		success: 'circle-check',
		warning: 'triangle-exclamation',
		error: 'circle-exclamation',
	}

	if (icon === true && defaultIconMap[variant]) {
		icon = defaultIconMap[variant]
	}

	let snackbar = document.querySelector<AppSnackbar>('app-snackbar#snackbar')

	const template = html` ${when(icon, () => html`<app-icon slot="icon" name=${icon}></app-icon>`)} ${message} `

	// If exist update else create
	if (snackbar) {
		Object.assign(snackbar, { variant, duration })
		render(template, snackbar)
	} else {
		snackbar = Object.assign(document.createElement('app-snackbar'), {
			id: 'global-message',
			variant,
			duration,
		})
		render(template, snackbar)
		render(snackbar, document.body)
	}

	// Remove from DOM after hide animation finishes
	snackbar.addEventListener('app-after-hide', () => snackbar.remove())

	return snackbar.show()
}
