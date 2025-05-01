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
