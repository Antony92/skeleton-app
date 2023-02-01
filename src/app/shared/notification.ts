import { escapeHtml } from '../utils/html'

type Notification = {
	message: string
	variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger'
	icon?: string
	duration?: number
}

export const notify = async (notification: Notification) => {
	await import('@shoelace-style/shoelace/dist/components/alert/alert.js')

	const { message, variant = 'primary', icon = 'info-circle', duration = 3000 } = notification
	const alert = Object.assign(document.createElement('sl-alert'), {
		variant,
		closable: true,
		duration,
		innerHTML: `
            <sl-icon name=${icon} slot="icon"></sl-icon>
            ${escapeHtml(message)}
        `,
	})

	document.body.appendChild(alert)
	return alert.toast()
}
