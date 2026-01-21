import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { appSidebarStyle } from '@app/elements/sidebar/app-sidebar.style'
import { whenUserRole } from '@app/directives/when-user-role.directive'
import { classMap } from 'lit/directives/class-map.js'
import { Role } from '@app/types/user.type'
import '@app/elements/icon/app-icon.element'

@customElement('app-sidebar')
export class AppSidebar extends LitElement {
	static styles = [appSidebarStyle, css``]

	connectedCallback() {
		super.connectedCallback()
		window.navigation.addEventListener('navigatesuccess', this.setActiveLink)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		window.navigation.removeEventListener('navigatesuccess', this.setActiveLink)
	}

	setActiveLink = (event: Event) => {
		const target = event.target as Navigation
		const url = new URL(target.currentEntry?.url || '')
		this.renderRoot.querySelector('a.active')?.classList.remove('active')
		this.renderRoot.querySelector(`a[href="/${url.pathname.split('/')[1]}"]`)?.classList.add('active')
	}

	render() {
		return html`
			<aside>
				<ul>
					<li>
						<a href="/home" class=${classMap({ active: location.pathname.includes('/home') })}>
							<span>
								<app-icon class="icon" filled>home</app-icon>
							</span>
							<span>Home</span>
						</a>
					</li>
					<li>
						<a href="/demo" class=${classMap({ active: location.pathname.includes('/demo') })}>
							<span>
								<app-icon class="icon" filled>skull</app-icon>
							</span>
							<span>Demo</span>
						</a>
					</li>
					<li>
						<a href="/form" class=${classMap({ active: location.pathname.includes('/form') })}>
							<span>
								<app-icon class="icon" filled>list_alt</app-icon>
							</span>
							<span>Form</span>
						</a>
					</li>
					<li>
						<a href="/table" class=${classMap({ active: location.pathname.includes('/table') })}>
							<span>
								<app-icon class="icon" filled>table</app-icon>
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
										<app-icon class="icon" filled>admin_panel_settings</app-icon>
									</span>
									<span>Admin</span>
								</a>
							</li>
						`,
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
