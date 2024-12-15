import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { appSidebarStyle } from '@app/elements/sidebar/app-sidebar.style'
import { Router, RouterLocation } from '@vaadin/router'
import { whenUserRole } from '@app/directives/when-user-role.directive'
import { classMap } from 'lit/directives/class-map.js'
import { Role } from '@app/types/user.type'
import "@app/elements/icon/app-icon.element"

@customElement('app-sidebar')
export class AppSidebar extends LitElement {
	static styles = [appSidebarStyle, css``]

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('vaadin-router-location-changed', this.setActiveLink)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		window.removeEventListener('vaadin-router-location-changed', this.setActiveLink)
	}

	setActiveLink = (event: CustomEvent<{ router: Router; location: RouterLocation }>) => {
		const {
			location: { pathname },
		} = event.detail
		this.renderRoot.querySelector('a.active')?.classList.remove('active')
		this.renderRoot.querySelector(`a[href="/${pathname.split('/')[1]}"]`)?.classList.add('active')
	}

	// use router-ignore attribute for ignoring routing
	render() {
		return html`
			<aside>
				<ul>
					<li>
						<a href="/home" class=${classMap({ active: location.pathname.includes('/home') })}>
							<span>
								<app-icon name="home" class="icon"></app-icon>
							</span>
							<span>Home</span>
						</a>
					</li>
					<li>
						<a href="/demo" class=${classMap({ active: location.pathname.includes('/demo') })}>
							<span>
								<app-icon name="skull" class="icon"></app-icon>
							</span>
							<span>Demo</span>
						</a>
					</li>
					<li>
						<a href="/table" class=${classMap({ active: location.pathname.includes('/table') })}>
							<span>
								<app-icon name="table" class="icon"></app-icon>
							</span>
							<span>Table</span>
						</a>
					</li>
					${whenUserRole(
						[Role.ADMIN],
						() => html`
							<li class="bottom" hide-on-mobile>
								<a href="/admin" class=${classMap({ active: location.pathname.includes('/admin') })}>
									<span>
										<app-icon name="screwdriver-wrench" class="icon"></app-icon>
									</span>
									<span>Admin</span>
								</a>
							</li>
						`
					)}
				</ul>
			</aside>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-sidebar': AppSidebar
	}
}
