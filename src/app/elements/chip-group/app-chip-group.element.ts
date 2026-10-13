import type { AppChip } from '@app/elements/chip/app-chip.element';
import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

@customElement('app-chip-group')
export class AppChipGroup extends LitElement {
	static styles = [
		defaultStyle,
		css`
			.container {
				display: flex;
				flex-wrap: wrap;
				gap: 10px;
			}
		`,
	];

	@property({ type: String })
	accessor value = '';

	@property({ type: Boolean })
	accessor disabled = false;

	@property({ type: Boolean })
	accessor multiple = false;

	@queryAssignedElements()
	accessor chips!: AppChip[];

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (target.tagName === 'APP-CHIP') {
				event.stopPropagation();
				const chip = target as AppChip;
				if (this.multiple) {
					this.value = this.chips
						.filter((t) => t.active)
						.map((t) => t.value)
						.join(', ');
				} else {
					this.value = chip.active ? chip.value : '';
				}
				this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }));
			}
		});
	}

	protected updated(_changedProperties: PropertyValues) {
		super.updated(_changedProperties);
		this.chips.forEach((chip) => {
			if (this.multiple) {
				chip.active = this.value.includes(chip.value);
			} else {
				chip.active = !!this.value && chip.value === this.value;
			}
			chip.disabled = this.disabled;
		});
	}

	render() {
		return html`<div class="container"><slot></slot></div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-chip-group': AppChipGroup;
	}
}
