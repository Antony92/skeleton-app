import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('app-theme-switcher')
export class AppThemeSwitcher extends LitElement {
	static styles = css``

	@property({ type: String, reflect: true })
	theme: 'auto' | 'light' | 'dark' | string = localStorage.getItem('theme') || 'auto'

	preferedDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	preferedLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches

	changeTheme(event: Event) {
		const value = (event.target as HTMLSelectElement).value
		this.theme = value
		localStorage.setItem('theme', this.theme)

		const body = document.querySelector('body')!

		if (this.theme === 'light' || (this.theme === 'auto' && this.preferedLight)) {
			body.classList.add('theme-light')
			body.classList.remove('theme-dark')
		}

		if (this.theme === 'dark' || (this.theme === 'auto' && this.preferedDark)) {
			body.classList.add('theme-dark')
			body.classList.remove('theme-light')
		}
	}

	render() {
		return html`
			<select @change=${this.changeTheme} .value=${this.theme}>
				<option value="auto">Auto</option>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-theme-switcher': AppThemeSwitcher
	}
}
