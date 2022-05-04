import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

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
						<a href="/">Home</a>
					</li>
					<li>
						<a href="/showcase/default">Showcase Table</a>
					</li>
					<li>
						<a href="/showcase/form">Showcase Form</a>
					</li>
					<li>
						<a href="/showcase/autocomplete">Showcase Autocomplete</a>
					</li>
					<li>
						<a href="/showcase/dialog">Showcase Dialog</a>
					</li>
				</ul>
			</nav>
		`
	}
}
