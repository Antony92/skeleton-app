export const initTheme = () => {
	const selectedTheme = localStorage.getItem('theme')
	const body = document.querySelector('body')

	const preferedLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
	const preferedDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

	if (selectedTheme === 'light' || preferedLight) {
		body?.classList.add('theme-light')
		body?.classList.remove('theme-dark', 'sl-theme-dark')
		return
	}

	if (selectedTheme === 'dark' || preferedDark) {
		body?.classList.add('theme-dark', 'sl-theme-dark')
		body?.classList.remove('theme-light')
		return
	}
}
