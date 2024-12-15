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

export const setDocumentTitle = (title: string) => {
	document.title = `Skeleton App - ${title}`
}