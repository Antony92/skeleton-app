import type { AppTag } from '@app/elements/tag/app-tag.element';
import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

@customElement('app-tag-group')
export class AppTagGroup extends LitElement {
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
	accessor tags!: AppTag[];

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('app-tag-click', (event) => {
			const tag = event.target as AppTag;
			if (this.multiple) {
				this.value = this.tags
					.filter((t) => t.active)
					.map((t) => t.value)
					.join(', ');
			} else {
				this.value = tag.active ? tag.value : '';
			}
			this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }));
		});
	}

	protected updated(_changedProperties: PropertyValues) {
		super.updated(_changedProperties);
		this.tags.forEach((tag) => {
			if (this.multiple) {
				tag.active = this.value.includes(tag.value);
			} else {
				tag.active = !!this.value && tag.value === this.value;
			}
			tag.disabled = this.disabled;
		});
	}

	render() {
		return html`<div class="container"><slot></slot></div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-tag-group': AppTagGroup;
	}
}
