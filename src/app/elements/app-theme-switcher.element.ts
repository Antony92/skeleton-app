import { html, LitElement, css } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/divider/divider.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'

@customElement('app-theme-switcher')
export class AppThemeSwitcher extends LitElement {
	static styles = css``

	@query('sl-dropdown') dropdown!: HTMLElementTagNameMap['sl-dropdown']

	@state()
	private theme: 'auto' | 'light' | 'dark' | string = 'auto'
	
	@state()
	private icon = 'moon-stars-fill'

	private preferedDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	private preferedLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches

	constructor() {
		super()
		this.theme = localStorage.getItem('theme') ?? 'auto'
		if (this.theme === 'light' || (this.theme === 'auto' && this.preferedLight)) this.icon = 'sun-fill'
		if (this.theme === 'dark'|| (this.theme === 'auto' && this.preferedDark)) this.icon = 'moon-stars-fill'
	}

	override firstUpdated() {
		this.dropdown.addEventListener('sl-select', (event: Event) => {
			const selectedItem = (event as CustomEvent).detail.item
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

		})
	}

	override render() {
		return html`
			<sl-dropdown>
				<sl-button name="Theme" slot="trigger" caret pill size="small">
					<sl-icon name=${this.icon}></sl-icon>
				</sl-button>
				<sl-menu>
					<sl-menu-item value="light" ?checked=${this.theme === 'light'}>Light</sl-menu-item>
					<sl-menu-item value="dark" ?checked=${this.theme === 'dark'}>Dark</sl-menu-item>
					<sl-divider></sl-divider>
					<sl-menu-item value="auto" ?checked=${this.theme === 'auto'}>Auto</sl-menu-item>
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