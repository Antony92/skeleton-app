/**
 * Escape string from all html specific tags
 * @param html
 * @returns escaped string
 */
export const escapeHtml = (html: string) => {
	if (!html) return ''

	return html
		.toString()
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
		.replace(/`(.*?)`/g, '<code>$1</code>')
}

/**
 * Set page title based on app config + provided title
 * @param title
 */
export const setPageTitle = (title: string) => {
	document.title = `${import.meta.env.VITE_APP_TITLE} - ${title}`
}

/**
 * Transform html form to object
 * @param form
 * @returns object
 */
export const serializeForm = (form: HTMLFormElement) => {
	return Object.fromEntries(new FormData(form).entries())
}

/**
 * Format bytes to user readable
 * @param bytes
 * @param decimals
 * @returns pretty string
 */
export const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return '0 Bytes'

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const debounce = (func: Function, timeout = 300) => {
	let timer: number
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (...args: any) => {
		clearTimeout(timer)
		timer = setTimeout(() => func.apply(this, args), timeout)
	}
}
