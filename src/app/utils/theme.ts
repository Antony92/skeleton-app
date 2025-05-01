/**
 * Apply default theme based on user preferences
 */
export const applyDefaultTheme = () => {
	const theme = localStorage.getItem('theme')
	const body = document.querySelector('body')

	const preferedLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
	const preferedDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

	if (theme === 'light' || preferedLight) {
		body?.classList.toggle('theme-light')
		return
	}

	if (theme === 'dark' || preferedDark) {
		body?.classList.toggle('theme-dark')
		return
	}
}
