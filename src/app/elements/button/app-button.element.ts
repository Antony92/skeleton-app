import { appButtonStyle } from '@app/elements/button/app-button.style';
import { defaultStyle } from '@app/styles/default.style';
import { focusStyle } from '@app/styles/focus.style';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';

@customElement('app-button')
export class AppButton extends LitElement {
	static styles = [
		defaultStyle,
		appButtonStyle,
		focusStyle,
		css`
			:host {
				--background: var(--theme-default-background);
				--color: var(--theme-white-color);
			}
		`,
	];

	@property({ type: String })
	accessor variant: 'default' | 'primary' | 'success' | 'warning' | 'error' = 'default';

	@property({ type: String })
	accessor appearance: 'normal' | 'outlined' | 'plain' = 'normal';

	@property({ type: String })
	accessor type: 'button' | 'submit' | 'reset' = 'button';

	@property({ type: String })
	accessor size: 'small' | 'normal' = 'normal';

	@property({ type: Boolean })
	accessor disabled = false;

	@property({ type: Boolean })
	accessor outlined = false;

	@property({ type: Boolean })
	accessor loading = false;

	@property({ type: String })
	accessor href = '';

	@property({ type: String })
	accessor target = '';

	@property({ type: String })
	accessor download: string | undefined;

	static formAssociated = true;
	internals = this.attachInternals();

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', (e) => {
			if (e.defaultPrevented) return;
			if (this.type === 'submit') {
				this.internals.form?.requestSubmit();
			}
			if (this.type === 'reset') {
				this.internals.form?.reset();
			}
		});
	}

	render() {
		return html`
			${when(
				this.href,
				() => html`
					<a
						part="button"
						role="button"
						class=${classMap({
							small: this.size === 'small',
							'focus-visible': true,
						})}
						href=${this.href}
						target=${this.target}
						download=${ifDefined(this.download)}
						?autofocus=${this.autofocus}
					>
					  <slot></slot>
					</a>
				`,
				() => html`
					<button
						part="button"
						role="button"
						class=${classMap({
							small: this.size === 'small',
							'focus-visible': true,
						})}
						?disabled=${this.disabled || this.loading}
						?autofocus=${this.autofocus}
					>
						${when(this.loading, () => html`<div class="loader"></div`)}
						<slot></slot>
					</button>
				`,
			)}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-button': AppButton;
	}
}
