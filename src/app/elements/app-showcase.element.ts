import { html, LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { choose } from 'lit/directives/choose.js'
import '@shoelace-style/shoelace/dist/components/input/input.js';

@customElement('app-showcase')
export class AppShowcase extends LitElement {
	static styles = css``

	@property({ type: String })
	component = 'default'

	constructor() {
		super()
	}

	override render() {
		return html`${choose(this.component, [
			['default', () => html`<sl-input placeholder="Type something"></sl-input>`],
		])}`
	}
}
