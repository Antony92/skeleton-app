import { html, render } from 'lit'

/**
 * Show generic dialog
 * @param title
 * @param message
 * @returns Promise
 */
export const dialog = async (options: { header: string; message: string; modal?: boolean }) => {
	await import('@app/elements/dialog/app-dialog.element')
	await import('@app/elements/button/app-button.element')

	const { promise, resolve, reject } = Promise.withResolvers<void>()

	// Don't open dialog if another is already opened
	if (document.body.querySelector('app-dialog#dialog')) {
		reject('Dialog already opened')
		return
	}

	const { header, message, modal = false } = options

	const template = html`
		${message}
		<app-button slot="footer" class="primary" autofocus app-dialog-close>Close</app-button>
	`

	const dialog = Object.assign(document.createElement('app-dialog'), {
		id: 'dialog',
		header,
		modal,
	})

	// Render template in dialog
	render(template, dialog)

	// On hide complete remove dialog from DOM
	dialog.addEventListener('app-after-hide', () => dialog.remove())

	// Resolve when dialog hide
	dialog.addEventListener('app-hide', async () => resolve())

	// Render dialog in body
	document.body.appendChild(dialog)

	// Show dialog
	dialog.show()

	return promise
}

/**
 * Show confirmation dialog
 * @param options
 * @returns Promise
 */
export const confirmDialog = async (options: { header: string; message: string }) => {
	await import('@app/elements/dialog/app-dialog.element')
	await import('@app/elements/button/app-button.element')

	const { promise, resolve, reject } = Promise.withResolvers<boolean>()

	// Don't open dialog if another is already opened
	if (document.body.querySelector('app-dialog#confirm-dialog')) {
		reject('Dialog already opened')
		return
	}

	const { header, message } = options

	const template = html`
		${message}
		<app-button slot="footer" variant="primary" text app-dialog-close="false">Cancel</app-button>
		<app-button slot="footer" variant="primary" autofocus app-dialog-close="true">Confirm</app-button>
	`

	const dialog = Object.assign(document.createElement('app-dialog'), {
		id: 'confirm-dialog',
		header,
		modal: true,
	})

	// Render template in dialog
	render(template, dialog)

	// On hide complete remove dialog from DOM
	dialog.addEventListener('app-after-hide', () => dialog.remove())

	// Resolve when dialog hide
	dialog.addEventListener('app-hide', async () => resolve(dialog.returnValue === 'true'))

	// Append dialog to body
	document.body.appendChild(dialog)

	// Show dialog
	dialog.show()

	return promise
}

/**
 * Show confirmation dialog with input
 * @param options
 * @returns Promise
 */
export const confirmInputDialog = async (options: { header: string; message: string; word: string }) => {
	await import('@app/elements/dialog/app-dialog.element')
	await import('@app/elements/button/app-button.element')
	await import('@app/elements/input/app-input.element')

	const { promise, resolve, reject } = Promise.withResolvers<boolean>()

	// Don't open dialog if another is already opened
	if (document.body.querySelector('app-dialog#confirm-input-dialog')) {
		reject('Dialog already opened')
		return
	}

	const { header, message, word } = options

	const template = html`
		${message}
		<br/><br/>
		<app-input placeholder="Type '${word}'" pattern="${word}" required autofocus></app-input>
		<app-button slot="footer" variant="primary" text app-dialog-close="false">Cancel</app-button>
		<app-button slot="footer" variant="primary" id="confirm">Confirm</app-button>
	`

	const dialog = Object.assign(document.createElement('app-dialog'), {
		id: 'confirm-input-dialog',
		header,
		modal: true,
	})

	// Render template in dialog
	render(template, dialog)

	// On hide complete remove dialog from DOM
	dialog.addEventListener('app-after-hide', () => dialog.remove())

	// Input element
	const input = dialog.querySelector('app-input')!

	// Validate input on confirm click
	dialog.querySelector('#confirm')?.addEventListener('click' , () => {
		if (!input.checkValidity()) {
			input.focus()
		} else {
			dialog.hide('true')
		}
	})

	// Resolve when dialog hide
	dialog.addEventListener('app-hide', async () => resolve(dialog.returnValue === 'true'))

	// Append dialog to body
	document.body.appendChild(dialog)

	// Show dialog
	dialog.show()

	return promise
}
