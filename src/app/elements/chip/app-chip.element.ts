import { appChipStyle } from '@app/elements/chip/app-chip.style';
import { defaultStyle } from '@app/styles/default.style';
import { focusStyle } from '@app/styles/focus.style';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('app-chip')
export class AppChip extends LitElement {
	static styles = [defaultStyle, focusStyle, appChipStyle, css``];

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
		'app-chip': AppChip;
	}
}
