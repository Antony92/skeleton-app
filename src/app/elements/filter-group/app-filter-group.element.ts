import type { AppFilter } from '@app/elements/filter/app-filter.element';
import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

@customElement('app-filter-group')
export class AppFilterGroup extends LitElement {
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
	accessor filters!: AppFilter[];

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (target.tagName === 'APP-FILTER') {
				event.stopPropagation();
				const filter = target as AppFilter;
				if (this.multiple) {
					this.value = this.filters
						.filter((t) => t.active)
						.map((t) => t.value)
						.join(', ');
				} else {
					this.value = filter.active ? filter.value : '';
				}
				this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }));
			}
		});
	}

	protected updated(_changedProperties: PropertyValues) {
		super.updated(_changedProperties);
		this.filters.forEach((filter) => {
			if (this.multiple) {
				filter.active = this.value.includes(filter.value);
			} else {
				filter.active = !!this.value && filter.value === this.value;
			}
			filter.disabled = this.disabled;
		});
	}

	render() {
		return html`<div class="container"><slot></slot></div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-filter-group': AppFilterGroup;
	}
}
