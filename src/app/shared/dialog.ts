import { escapeHtml } from '../utils/html'

/**
 * Show generic dialog
 * @param title 
 * @param message 
 * @returns Promise
 */
export const dialog = async (title: string, message: string) => {
	await import('@shoelace-style/shoelace/dist/components/dialog/dialog.js')
	await import('@shoelace-style/shoelace/dist/components/button/button.js')

	const { promise, resolve, reject } = Promise.withResolvers<void>()

	// Don't open dialog if another is already opened
	if (document.body.querySelector('#dialog')) {
		reject('Dialog already opened')
		return
	}

	const dialog = Object.assign(document.createElement('sl-dialog'), {
		id: 'dialog',
		label: title,
		innerHTML: `
			${escapeHtml(message)}
			<sl-button slot="footer" variant="primary">Close</sl-button>
		`,
	})

	const closeButton = dialog.querySelector('sl-button[slot="footer"]')!

	dialog.addEventListener('sl-request-close', (event) => {
		// Prevent the dialog from closing when the user clicks on the overlay
		if (event.detail.source === 'overlay') {
			event.preventDefault()
		} else {
			resolve()
		}
	})

	// On hide complete remove dialog from DOM
	dialog.addEventListener('sl-after-hide', () => dialog.remove())

	// Resolve when dialog hide completes on close button click
	closeButton.addEventListener('click', async () => {
		await dialog.hide()
		resolve()
	})

	// Append dialog to body
	document.body.appendChild(dialog)

	// Wait for append to complete before showing the dialog in order to correctly display animations
	requestAnimationFrame(() => {
		dialog.getBoundingClientRect()
		dialog.show()
	})

	return promise
}

/**
 * Show confirmation dialog
 * @param title 
 * @param message 
 * @returns Promise
 */
export const confirmDialog = async (title: string, message: string) => {
	await import('@shoelace-style/shoelace/dist/components/dialog/dialog.js')
	await import('@shoelace-style/shoelace/dist/components/button/button.js')

	const { promise, resolve, reject } = Promise.withResolvers<boolean>()

	// Don't open dialog if another is already opened
	if (document.body.querySelector('#confirm-dialog')) {
		reject('Dialog already opened')
		return
	}

	const dialog = Object.assign(document.createElement('sl-dialog'), {
		id: '#confirm-dialog',
		label: title,
		innerHTML: `
			${escapeHtml(message)}
			<sl-button slot="footer" class="cancel" variant="text">Cancel</sl-button>
			<sl-button slot="footer" class="confirm" variant="primary">Confirm</sl-button>
		`,
	})

	const cancelButton = dialog.querySelector('sl-button[slot="footer"].cancel')!
	const confirmButton = dialog.querySelector('sl-button[slot="footer"].confirm')!

	dialog.addEventListener('sl-request-close', (event) => {
		// Prevent the dialog from closing when the user clicks on the overlay
		if (event.detail.source === 'overlay') {
			event.preventDefault()
		} else {
			resolve(false)
		}
	})

	// On hide complete remove dialog from DOM
	dialog.addEventListener('sl-after-hide', () => dialog.remove())

	// Resolve with false when dialog hide completes on cancel button click
	cancelButton.addEventListener('click', async () => {
		await dialog.hide()
		resolve(false)
	})

	// Resolve with true when dialog hide completes on confirm button click
	confirmButton.addEventListener('click', async () => {
		await dialog.hide()
		resolve(true)
	})

	// Append dialog to body
	document.body.appendChild(dialog)

	// Wait for append to complete before showing the dialog in order to correctly display animations
	requestAnimationFrame(() => {
		dialog.getBoundingClientRect()
		dialog.show()
	})

	return promise
}

/**
 * Show confirmation with captcha dialog
 * @param title 
 * @param message 
 * @param confirmWord defaults to 'confirm'
 * @returns Promise
 */
export const captchaDialog = async (title: string, message: string, confirmWord = 'confirm') => {
	await import('@shoelace-style/shoelace/dist/components/dialog/dialog.js')
	await import('@shoelace-style/shoelace/dist/components/input/input.js')
	await import('@shoelace-style/shoelace/dist/components/button/button.js')

	const { promise, resolve, reject } = Promise.withResolvers<boolean>()

	// Don't open dialog if another is already opened
	if (document.body.querySelector('#confirm-captcha-dialog')) {
		reject('Dialog already opened')
		return
	}

	const dialog = Object.assign(document.createElement('sl-dialog'), {
		id: '#confirm-captcha-dialog',
		label: title,
		innerHTML: `
			${escapeHtml(message)}
			<br /><br />
			<sl-input autofocus label="Confirmation" placeholder="Type the required word to proceed" help-text="Type '${confirmWord}'"></sl-input>
			<sl-button slot="footer" class="cancel" variant="text">Cancel</sl-button>
			<sl-button slot="footer" class="confirm" variant="primary" disabled>Confirm</sl-button>
		`,
	})

	const input = dialog.querySelector('sl-input')!
	const cancelButton = dialog.querySelector('sl-button[slot="footer"].cancel')!
	const confirmButton = dialog.querySelector('sl-button[slot="footer"].confirm')!

	dialog.addEventListener('sl-request-close', (event) => {
		// Prevent the dialog from closing when the user clicks on the overlay
		if (event.detail.source === 'overlay') {
			event.preventDefault()
		} else {
			resolve(false)
		}
	})

	// On hide complete remove dialog from DOM
	dialog.addEventListener('sl-after-hide', () => dialog.remove())

	// Enable/disable confirm button based on correct confirmWord
	input.addEventListener('input', () => {
		if (input.value === confirmWord) {
			confirmButton.removeAttribute('disabled')
		} else {
			confirmButton.setAttribute('disabled', '')
		}
	})

	// Resolve with false when dialog hide completes on cancel button click
	cancelButton.addEventListener('click', async () => {
		await dialog.hide()
		resolve(false)
	})

	// Resolve with true when dialog hide completes on confirm button click
	confirmButton.addEventListener('click', async () => {
		await dialog.hide()
		resolve(true)
	})

	// Append dialog to body
	document.body.appendChild(dialog)

	// Wait for append to complete before showing the dialog in order to correctly display animations
	requestAnimationFrame(() => {
		dialog.getBoundingClientRect()
		dialog.show()
	})

	return promise
}
