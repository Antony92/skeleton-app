import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { appBadgeStyle } from '@app/elements/badge/app-badge.style'
import { classMap } from 'lit/directives/class-map.js'
import { defaultStyle } from '@app/styles/default.style'

@customElement('app-badge')
export class AppBadge extends LitElement {
	static styles = [defaultStyle, appBadgeStyle, css``]

	@property({ type: String })
	variant: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default'

	@property({ type: Boolean })
	pulse = false

	render() {
		return html`
			<div part="badge" class="${classMap({ badge: true, pulse: this.pulse, [this.variant]: true })}">
				<slot></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-badge': AppBadge
	}
}
