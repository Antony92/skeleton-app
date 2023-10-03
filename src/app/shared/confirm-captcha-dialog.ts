import { escapeHtml } from '../utils/html'

export const confirmCaptchaDialog = (title: string, message: string, typing = 'confirm'): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		await import('@shoelace-style/shoelace/dist/components/dialog/dialog.js')
		await import('@shoelace-style/shoelace/dist/components/input/input.js')
		await import('@shoelace-style/shoelace/dist/components/button/button.js')

		if (document.body.querySelector('#confirm-captcha-dialog')) {
			reject('Dialog already opened')
			return
		}

		const dialog = Object.assign(document.createElement('sl-dialog'), {
			id: 'confirm-captcha-dialog',
			label: title,
			innerHTML: `
                ${escapeHtml(message)}
				<br /><br />
				<sl-input autofocus label="Confirmation" placeholder="Type the required word to proceed" help-text="Type '${typing}'"></sl-input>
				<sl-button slot="footer" class="cancel" variant="text">Cancel</sl-button>
				<sl-button slot="footer" class="confirm" variant="primary" disabled>Confirm</sl-button>
            `,
		})

		const input = dialog.querySelector('sl-input')!
		const cancelButton = dialog.querySelector('.cancel')!
		const confirmButton = dialog.querySelector('.confirm')!

		input.addEventListener('input', () => {
			if (input.value === typing) {
				confirmButton.removeAttribute('disabled')
			}
		})

		// Prevent the dialog from closing when the user clicks on the overlay
		dialog.addEventListener('sl-request-close', (event) => {
			if (event.detail.source === 'overlay') {
				event.preventDefault()
			}
			if (event.detail.source === 'close-button' || event.detail.source === 'keyboard') {
				resolve(false)
			}
		})

		dialog.addEventListener('sl-after-hide', () => dialog.remove())

		cancelButton.addEventListener('click', (event) => {
			dialog.hide().then(() => resolve(false))
		})
		confirmButton.addEventListener('click', (event) => {
			if (input.value === typing) {
				dialog.hide().then(() => resolve(true))
			}
		})

		document.body.appendChild(dialog)

		requestAnimationFrame(() => {
			dialog.getBoundingClientRect()
			dialog.show()
		})
	})
}
