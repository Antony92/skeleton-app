export const notify = async (message: string, variant = 'primary', icon = 'info-circle', duration = 3000) => {
	await import('@shoelace-style/shoelace/dist/components/alert/alert.js')

	const alert = Object.assign(document.createElement('sl-alert'), {
		variant,
		closable: true,
		duration: duration,
		innerHTML: `
            <sl-icon name="${icon}" slot="icon"></sl-icon>
            ${message}
        `,
	})

	document.body.append(alert)
	return alert.toast()
}
