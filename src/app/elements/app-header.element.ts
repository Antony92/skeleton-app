import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('app-header')
export class AppHeader extends LitElement {
	static styles = css`
		header {
			height: 56px;
			width: 100%;
			background: var(--header-background, #673ab7);
			color: var(--text-primary, #ffffff);
			box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
			line-height: 56px;
		}

		.title {
			margin-left: 10px;
		}
	`

	@property({ type: String, attribute: 'app-title' })
	appTitle = 'AppTitle'

	protected render() {
		return html`
			<header>
				<span class="title">${this.appTitle}</span>
			</header>
		`
	}
}
