import { escapeHtml } from '../utils/html'

export const dialog = (title: string, message: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		await import('@shoelace-style/shoelace/dist/components/dialog/dialog.js')
		await import('@shoelace-style/shoelace/dist/components/button/button.js')

		if (document.body.querySelector('#dialog')) {
			reject('Dialog already opened')
			return
		}

		const dialog = Object.assign(document.createElement('sl-dialog'), {
			id: 'dialog',
			label: title,
			innerHTML: `
                ${escapeHtml(message)}
                <sl-button slot="footer" class="close" variant="primary">Close</sl-button>
            `,
		})

		// Prevent the dialog from closing when the user clicks on the overlay
		dialog.addEventListener('sl-request-close', (event) => {
			if (event.detail.source === 'overlay') {
				event.preventDefault()
			}
			if (event.detail.source === 'close-button' || event.detail.source === 'keyboard') {
				resolve()
			}
		})

		dialog.addEventListener('sl-after-hide', () => dialog.remove())

		dialog.querySelector('.close')?.addEventListener('click', (event) => {
			dialog.hide().then(() => resolve())
		})

		document.body.appendChild(dialog)
		
		requestAnimationFrame(() => {
			dialog.getBoundingClientRect()
			dialog.show()
		})
	})
}
