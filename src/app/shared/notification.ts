import { escapeHtml } from '@app/utils/html'

type Notification = {
	message: string
	variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger'
	icon?: string
	duration?: number
}

export const notify = async (notification: Notification) => {
	await import('@shoelace-style/shoelace/dist/components/alert/alert.js')

	const { message, variant = 'primary', duration = 3000 } = notification

	if (!notification.icon && variant === 'primary') notification.icon = 'info-circle'
	if (!notification.icon && variant === 'success') notification.icon = 'check2-circle'
	if (!notification.icon && variant === 'neutral') notification.icon = 'gear'
	if (!notification.icon && variant === 'warning') notification.icon = 'exclamation-triangle'
	if (!notification.icon && variant === 'danger') notification.icon = 'exclamation-octagon'

	const alert = Object.assign(document.createElement('sl-alert'), {
		variant,
		closable: true,
		duration,
		innerHTML: `
            <sl-icon name=${notification.icon} slot="icon"></sl-icon>
            ${escapeHtml(message)}
        `,
	})

	document.body.appendChild(alert)
	return alert.toast()
}
