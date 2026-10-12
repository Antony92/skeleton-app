import { appFilterStyle } from '@app/elements/filter/app-filter.style';
import { defaultStyle } from '@app/styles/default.style';
import { focusStyle } from '@app/styles/focus.style';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('app-filter')
export class AppFilter extends LitElement {
	static styles = [defaultStyle, focusStyle, appFilterStyle, css``];

	@property({ type: String })
	accessor value = '';

	@property({ type: Boolean, reflect: true })
	accessor active = false;

	@property({ type: Boolean })
	accessor disabled = false;

	render() {
		return html`
			<button
				part="filter"
				?disabled=${this.disabled}
				class="${classMap({ 'focus-visible': true, active: this.active })}"
				@click=${() => (this.active = !this.active)}
			>
				<slot></slot>
			</button>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-filter': AppFilter;
	}
}
