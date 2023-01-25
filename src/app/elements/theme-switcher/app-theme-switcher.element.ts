import { html, LitElement, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/divider/divider.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'

@customElement('app-theme-switcher')
export class AppThemeSwitcher extends LitElement {
	static styles = css``

	@property({ type: String, reflect: true })
	theme: 'auto' | 'light' | 'dark' | string
	
	@state()
	icon = 'moon-stars-fill'

	preferedDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	preferedLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches

	constructor() {
		super()
		this.theme = localStorage.getItem('theme') ?? 'auto'
		if (this.theme === 'light' || (this.theme === 'auto' && this.preferedLight)) {
			this.icon = 'sun-fill'
		}
		if (this.theme === 'dark' || (this.theme === 'auto' && this.preferedDark)) {
			this.icon = 'moon-stars-fill'
		}
	}

	changeTheme(event: CustomEvent) {
		const selectedItem = event.detail.item
		this.theme = selectedItem.value
		localStorage.setItem('theme', this.theme)
		const body = document.querySelector('body')

		if (this.theme === 'light' || (this.theme === 'auto' && this.preferedLight)) {
			body?.classList.add('theme-light')
			body?.classList.remove('theme-dark', 'sl-theme-dark')
			this.icon = 'sun-fill'
		}

		if (this.theme === 'dark' || (this.theme === 'auto' && this.preferedDark)) {
			body?.classList.add('theme-dark', 'sl-theme-dark')
			body?.classList.remove('theme-light')
			this.icon = 'moon-stars-fill'
		}
	}

	override render() {
		return html`
			<sl-dropdown @sl-select=${this.changeTheme}>
				<sl-button name="Theme" slot="trigger" caret pill size="small">
					<sl-icon name=${this.icon}></sl-icon>
				</sl-button>
				<sl-menu>
					<sl-menu-item value="light" type="checkbox" ?checked=${this.theme === 'light'}>Light</sl-menu-item>
					<sl-menu-item value="dark" type="checkbox" ?checked=${this.theme === 'dark'}>Dark</sl-menu-item>
					<sl-divider></sl-divider>
					<sl-menu-item value="auto" type="checkbox" ?checked=${this.theme === 'auto'}>Auto</sl-menu-item>
				</sl-menu>
			</sl-dropdown>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-theme-switcher': AppThemeSwitcher
	}
}