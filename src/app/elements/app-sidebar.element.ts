import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/button/button.js';

@customElement('app-sidebar')
export class AppSidebar extends LitElement {
	static styles = css`
		ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		li {
			padding: 5px 15px;
		}

		a {
			cursor: pointer;
		}
	`

	override render() {
		return html`
			<nav>
				<ul>
					<li>
						<sl-button variant="text" href="/">Home</sl-button>
					</li>
					<li>
						<sl-button variant="text" href="/select">Select</sl-button>
					</li>
					<li>
						<sl-button variant="text" href="/form">Form</sl-button>
					</li>
				</ul>
			</nav>
		`
	}
}
