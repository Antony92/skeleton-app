import { escapeHtml } from '../utils/html'

export const confirmDialog = (title: string, message: string): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		await import('@shoelace-style/shoelace/dist/components/dialog/dialog.js')

		const dialog = Object.assign(document.createElement('sl-dialog'), {
			label: title,
			innerHTML: `
                ${escapeHtml(message)}
                <sl-button slot="footer" id="cancel" variant="text">Cancel</sl-button>
                <sl-button slot="footer" id="confirm" variant="primary">Confirm</sl-button>
            `,
		})

		// Prevent the dialog from closing when the user clicks on the overlay
		dialog.addEventListener('sl-request-close', (event) => {
			const source = (event as CustomEvent).detail.source
			if (source === 'overlay') event.preventDefault()
			if (source === 'close-button' || source === 'keyboard') resolve(false)
		})

		dialog.querySelector('#cancel')?.addEventListener('click', (event) => {
			dialog.hide().then(() => {
				dialog.remove()
				resolve(false)
			})
		})
		dialog.querySelector('#confirm')?.addEventListener('click', (event) => {
			dialog.hide().then(() => {
				dialog.remove()
				resolve(true)
			})
		})

		if (!document.body.contains(dialog)) {
			document.body.append(dialog)
			setTimeout(() => dialog.show(), 0)
		} else {
			reject('Dialog already opened')
		}
	})
}
