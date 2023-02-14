import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import { whenUser } from '../../directives/when-user.directive'
import { appSidebarStyle } from '../../styles/app-sidebar.style'
import { Router, RouterLocation } from '@vaadin/router'

@customElement('app-sidebar')
export class AppSidebar extends LitElement {
	static styles = [
		appSidebarStyle,
		css``
	]

	setActiveLink = (event: CustomEvent<{ router: Router, location: RouterLocation }>) => {
		const { location: { pathname } } = event.detail
		this.renderRoot.querySelector('a.active')?.classList.remove('active')
		this.renderRoot.querySelector(`a[href="${pathname}"]`)?.classList.add('active')
	}

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('vaadin-router-location-changed', this.setActiveLink)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		window.removeEventListener('vaadin-router-location-changed', this.setActiveLink)
	}

	// user router-ignore for ignoring routing
	render() {
		return html`
			<nav>
				<ul>
					<li>
						<a href="/">
							<span>
								<sl-icon name="house-door-fill"></sl-icon>
							</span>
							<span>Home</span>
						</a>
					</li>
					<li>
						<a href="/form">
							<span>
								<sl-icon name="postcard-fill"></sl-icon>
							</span>
							<span>Form</span>
						</a>
					</li>
					<li>
						<a href="/alerts">
							<span>
								<sl-icon name="exclamation-square-fill"></sl-icon>
							</span>
							<span>Alerts</span>
						</a>
					</li>
					<li>
						<a href="/table">
							<span>
								<sl-icon name="table"></sl-icon>
							</span>
							<span>Table</span>
						</a>
					</li>
					${whenUser(() => html`
						<li class="bottom hide-on-mobile">
							<a href="/admin">
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