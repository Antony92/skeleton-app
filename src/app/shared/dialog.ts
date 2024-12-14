import { escapeHtml } from '@app/utils/html'

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
	if (document.body.querySelector('#dialog')) {
		reject('Dialog already opened')
		return
	}

	const { header, message, modal = false } = options

	const dialog = Object.assign(document.createElement('app-dialog'), {
		id: 'dialog',
		header,
		modal,
		innerHTML: `
			${escapeHtml(message)}
			<app-button slot="footer" class="primary" autofocus app-dialog-close>Close</app-button>
		`,
	})

	// On hide complete remove dialog from DOM
	dialog.addEventListener('app-after-hide', () => dialog.remove())

	// Resolve when dialog hide
	dialog.addEventListener('app-hide', async () => resolve())

	// Append dialog to body
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
export const confirmDialog = async (options: { header: string; message: string; }) => {
	await import('@app/elements/dialog/app-dialog.element')
	await import('@app/elements/button/app-button.element')

	const { promise, resolve, reject } = Promise.withResolvers<boolean>()

	// Don't open dialog if another is already opened
	if (document.body.querySelector('#dialog')) {
		reject('Dialog already opened')
		return
	}

	const { header, message } = options

	const dialog = Object.assign(document.createElement('app-dialog'), {
		id: 'dialog',
		header,
		modal: true,
		innerHTML: `
			${escapeHtml(message)}
			<app-button slot="footer" variant="primary" text app-dialog-close="false">Cancel</app-button>
			<app-button slot="footer" variant="primary" autofocus app-dialog-close="true">Confirm</app-button>
		`,
	})

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
export const confirmInputDialog = async (options: { header: string; message: string; input: string; }) => {
	await import('@app/elements/dialog/app-dialog.element')
	await import('@app/elements/button/app-button.element')

	const { promise, resolve, reject } = Promise.withResolvers<boolean>()

	// Don't open dialog if another is already opened
	if (document.body.querySelector('#dialog')) {
		reject('Dialog already opened')
		return
	}

	const { header, message, input } = options

	const dialog = Object.assign(document.createElement('app-dialog'), {
		id: 'dialog',
		header,
		modal: true,
		innerHTML: `
			${escapeHtml(message)}
			<input value=${input}/>
			<app-button slot="footer" variant="primary" text app-dialog-close="false">Cancel</app-button>
			<app-button slot="footer" variant="primary">Confirm</app-button>
		`,
	})

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
