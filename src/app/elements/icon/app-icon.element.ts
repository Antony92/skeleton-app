import { findIconDefinition, icon, IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core'
import { html, LitElement, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'

@customElement('app-icon')
export class AppIcon extends LitElement {
	static styles = [
		css`
			:host {
				display: inline-block;
				width: 1em;
				height: 1em;

				svg {
					display: block;
					fill: currentColor;
					width: 100%;
					height: 100%;
				}
			}
		`,
	]

	@property({ type: String, reflect: true })
	prefix: IconPrefix = 'fas'

	@property({ type: String, reflect: true })
	name: IconName = 'skull'

	@state()
	svg = ''

	protected updated(changedProperties: PropertyValues): void {
		if (changedProperties.has('name')) {
			const definition = findIconDefinition({ prefix: this.prefix, iconName: this.name })
			this.svg = icon(definition)?.html[0] || 'not_found'
		}
	}

	render() {
		return html`${unsafeSVG(this.svg)}`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-icon': AppIcon
	}
}
