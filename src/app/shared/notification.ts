import { AppSnackbar } from '@app/elements/snackbar/app-snackbar.element'
import { html, render } from 'lit'
import { when } from 'lit/directives/when.js'

export const notify = async (notification: {
	message: string
	variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
	icon?: string | boolean
	duration?: number
	action?: string
}) => {
	await import('@app/elements/snackbar/app-snackbar.element')
	await import('@app/elements/icon/app-icon.element')
	await import('@app/elements/button/app-button.element')

	const { message, variant = 'default', duration = 3000, icon, action } = notification

	const defaultIconMap = {
		default: 'circle-info',
		primary: 'circle-info',
		success: 'circle-check',
		warning: 'triangle-exclamation',
		error: 'circle-exclamation',
	}

	let snackbar = document.querySelector<AppSnackbar>('app-snackbar#snackbar')

	const iconName = typeof icon === 'string' ? icon : defaultIconMap[variant]

	const template = html` ${when(icon, () => html`<app-icon slot="icon" name=${iconName}></app-icon>`)} ${message} `

	// If exist update else create
	if (snackbar) {
		Object.assign(snackbar, { variant, duration, action })
		render(template, snackbar)
	} else {
		snackbar = Object.assign(document.createElement('app-snackbar'), {
			id: 'global-message',
			variant,
			duration,
			action,
		})
		render(template, snackbar)
		render(snackbar, document.body)
	}

	// Remove from DOM after hide animation finishes
	snackbar.addEventListener('app-after-hide', () => snackbar.remove())

	return snackbar.show()
}
