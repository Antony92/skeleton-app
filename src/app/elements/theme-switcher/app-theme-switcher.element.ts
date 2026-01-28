import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@app/elements/dropdown/app-dropdown.element'
import '@app/elements/dropdown-item/app-dropdown-item.element'
import '@app/elements/button/app-button.element'
import '@app/elements/icon/app-icon.element'
import type { AppSelectEvent } from '@app/events/select.event'
import { choose } from 'lit/directives/choose.js'
import { defaultStyle } from '@app/styles/default.style'

@customElement('app-theme-switcher')
export class AppThemeSwitcher extends LitElement {
	static styles = [defaultStyle, css``]

	@property({ type: String, reflect: true })
	accessor theme: 'auto' | 'light' | 'dark' | string = localStorage.getItem('theme') || 'auto'

	preferedDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	preferedLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches

	changeTheme(event: AppSelectEvent) {
		this.theme = event.value
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
			<app-dropdown @app-select=${this.changeTheme} title="Choose theme">
				<app-button slot="trigger" appearance="plain">
					<app-icon filled>
						${choose(this.theme, [
							['light', () => html`light_mode`],
							['dark', () => html`dark_mode`],
							['auto', () => html`contrast`],
						])}
					</app-icon>
				</app-button>
				<app-dropdown-item value="light">
					<app-icon slot="prefix">light_mode</app-icon>
					Light theme
				</app-dropdown-item>
				<app-dropdown-item value="dark">
					<app-icon slot="prefix">dark_mode</app-icon>
					Dark theme
				</app-dropdown-item>
				<app-dropdown-item value="auto">
					<app-icon slot="prefix">contrast</app-icon>
					Device default
				</app-dropdown-item>
			</app-dropdown>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-theme-switcher': AppThemeSwitcher
	}
}
