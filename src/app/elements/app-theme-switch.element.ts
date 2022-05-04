import { html, LitElement, css } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/divider/divider.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'

@customElement('app-theme-switch')
export class AppThemeSwitch extends LitElement {
	static styles = css``

	@property({ type: String, reflect: true })
	theme: 'auto' | 'light' | 'dark' = 'auto'

	@query('sl-dropdown') dropdown!: any

	private icon = 'moon-stars-fill'

	private preferedDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
	private preferedLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches

	constructor() {
		super()
		this.theme = localStorage.getItem('theme') as any ?? 'auto'
	}

	override firstUpdated() {
		this.dropdown.addEventListener('sl-select', (event: CustomEvent) => {
			const selectedItem = event.detail.item
			this.theme = selectedItem.value
			localStorage.setItem('theme', this.theme)
			const body = document.querySelector('body')

			if (this.theme === 'light' || (this.theme === 'auto' && this.preferedLight)) {
				body?.classList.add('theme-light')
				body?.classList.remove('theme-dark', 'sl-theme-dark')
				this.icon = 'sun-fill'
			}

			if (this.theme === 'dark'|| (this.theme === 'auto' && this.preferedDark)) {
				body?.classList.add('theme-dark', 'sl-theme-dark')
				body?.classList.remove('theme-light')
				this.icon = 'moon-stars-fill'
			}

		})
	}

	override render() {
		return html`
			<sl-dropdown>
				<sl-button slot="trigger" caret pill>
					<sl-icon name="${this.icon}"></sl-icon>
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
