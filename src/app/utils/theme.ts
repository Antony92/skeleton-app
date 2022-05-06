export const initTheme = () => {
	const theme = localStorage.getItem('theme')
	const body = document.querySelector('body')

	const preferedLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
	const preferedDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

	if (theme === 'light' || preferedLight) {
		body?.classList.add('theme-light')
		body?.classList.remove('theme-dark', 'sl-theme-dark')
		return
	}

	if (theme === 'dark' || preferedDark) {
		body?.classList.add('theme-dark', 'sl-theme-dark')
		body?.classList.remove('theme-light')
		return
	}
}
