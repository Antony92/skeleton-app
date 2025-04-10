import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('app-icon')
export class AppIcon extends LitElement {
	static styles = [
		css`
			:host {
				font-family: 'Material Symbols Rounded';
				font-weight: normal;
				font-style: normal;
				font-size: 18px;
				line-height: 1;
				letter-spacing: normal;
				text-transform: none;
				display: inline-block;
				white-space: nowrap;
				word-wrap: normal;
				direction: ltr;
				-webkit-font-feature-settings: 'liga';
				-webkit-font-smoothing: antialiased;
			}

			:host([filled]) {
				font-variation-settings: 'FILL' 1;
			}
		`,
	]

	@property({ type: Boolean })
	filled = false

	render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-icon': AppIcon
	}
}
