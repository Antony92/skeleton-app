export const notify = async (
	message: string,
	variant: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' = 'primary',
	duration = 3000,
	icon = 'info-circle',
) => {
	await import('@shoelace-style/shoelace/dist/components/alert/alert.js')

	const alert = Object.assign(document.createElement('sl-alert'), {
		variant,
		closable: true,
		duration,
		innerHTML: `
            <sl-icon name="${icon}" slot="icon"></sl-icon>
            ${message}
        `,
	})

	document.body.append(alert)
	return alert.toast()
}
