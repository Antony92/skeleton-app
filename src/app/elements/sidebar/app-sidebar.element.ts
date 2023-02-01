import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import { whenUser } from '../../directives/when-user.directive'
import { appSidebarStyle } from '../../styles/app-sidebar.style'

@customElement('app-sidebar')
export class AppSidebar extends LitElement {
	static styles = [
		appSidebarStyle,
		css``
	]

	connectedCallback() {
		super.connectedCallback()
	}

	firstUpdated() {
		const path = location.pathname.split('/')[1]
		this.renderRoot.querySelector(`a[href="/${path}"]`)?.classList.add('active')
	}

	#handleLinkClick(event: Event) {
		const activeLink = this.renderRoot.querySelector('a.active')
		activeLink?.classList.remove('active')
		const clickedLink = <HTMLAnchorElement>event.currentTarget
		clickedLink?.classList.add('active')
	}

	render() {
		return html`
			<nav>
				<ul class="navigation-menu">
					<li>
						<a href="/" @click=${this.#handleLinkClick}>
							<span>
								<sl-icon name="house-door-fill"></sl-icon>
							</span>
							<span>Home</span>
						</a>
					</li>
					<li>
						<a href="/form" @click=${this.#handleLinkClick}>
							<span>
								<sl-icon name="postcard-fill"></sl-icon>
							</span>
							<span>Form</span>
						</a>
					</li>
					<li>
						<a href="/alerts" @click=${this.#handleLinkClick}>
							<span>
								<sl-icon name="exclamation-square-fill"></sl-icon>
							</span>
							<span>Alerts</span>
						</a>
					</li>
					<li>
						<a href="/table" @click=${this.#handleLinkClick}>
							<span>
								<sl-icon name="table"></sl-icon>
							</span>
							<span>Table</span>
						</a>
					</li>
					${whenUser(() => html`
						<li class="bottom hide-on-mobile">
							<a href="/admin" @click=${this.#handleLinkClick}>
								<span>
									<sl-icon name="person-fill-gear"></sl-icon>
								</span>
								<span>Admin</span>
							</a>
						</li>
					`)}
				</ul>
			</nav>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-sidebar': AppSidebar
	}
}