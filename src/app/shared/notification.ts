import { AppSnackbar } from '@app/elements/snackbar/app-snackbar.element'
import { html, render } from 'lit'
import { when } from 'lit/directives/when.js'

export const notify = async (notification: {
	message: string
	variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
	icon?: string | boolean
	duration?: number
	action?: {
		label: string,
		onAction?: (event: Event) => void
	}
}) => {
	await import('@app/elements/snackbar/app-snackbar.element')
	await import('@app/elements/icon/app-icon.element')
	await import('@app/elements/button/app-button.element')

	const { message, variant = 'default', duration = 3000, icon = true, action } = notification

	const defaultIconMap = {
		default: 'info',
		primary: 'info',
		success: 'check_circle',
		warning: 'warning',
		error: 'error',
	}

	let snackbar = document.querySelector<AppSnackbar>('app-snackbar#snackbar')

	const iconName = typeof icon === 'string' ? icon : defaultIconMap[variant]

	const template = html` ${when(icon, () => html`<app-icon slot="icon" filled>${iconName}</app-icon>`)} ${message} `

	// If exist update else create
	if (snackbar) {
		Object.assign(snackbar, { variant, duration, action: action?.label })
		render(template, snackbar)
	} else {
		snackbar = Object.assign(document.createElement('app-snackbar'), {
			id: 'snackbar',
			variant,
			duration,
			action: action?.label,
		})
		render(template, snackbar)
		document.body.appendChild(snackbar)
	}

	// Add snackbar action callback
	snackbar.addEventListener('app-snackbar-action', (event: Event) => action?.onAction?.(event))

	// Remove from DOM after hide animation finishes
	snackbar.addEventListener('app-after-hide', () => snackbar.remove())

	snackbar.show()
	
	return snackbar
}
