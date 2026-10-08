import type { AppTab } from '@app/elements/tab/app-tab.element';
import type { AppTabPanel } from '@app/elements/tab-panel/app-tab-panel.element';
import { defaultStyle } from '@app/styles/default.style';
import { css, html, LitElement } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';

@customElement('app-tab-group')
export class AppTabGroup extends LitElement {
	static styles = [
		defaultStyle,
		css`
			.container {
				display: flex;
				flex-direction: column;
				gap: 10px;

				.tabs {
					display: flex;
					gap: 5px;
					border-bottom: solid 2px var(--gray-4);
				}

				.panels {
					display: flex;
				}
			}
		`,
	];

	@queryAssignedElements({ slot: 'tab' })
	accessor tabs!: AppTab[];

	@queryAssignedElements()
	accessor panels!: AppTabPanel[];

	#activeTab = '';

	get activeTab() {
		return this.#activeTab;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('app-tab-click', (event) => {
			const tab = event.target as AppTab;
			const index = this.tabs.indexOf(tab);
			this.setActiveTab(index);
			this.dispatchEvent(new Event('app-change', { bubbles: true, composed: true }));
		});
	}

	protected firstUpdated() {
		const index = this.tabs.findIndex((tab) => tab.active);
		this.setActiveTab(index === -1 ? 0 : index);
	}

	setActiveTab(index = 0) {
		const tab = this.tabs.at(index);
		this.#activeTab = tab?.panel ?? '';
		this.tabs
			.filter((t) => t !== tab)
			.forEach((t) => {
				t.active = false;
			});
		this.panels.forEach((p) => {
			p.active = p.name === tab?.panel;
		});
	}

	private tabObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			const tab = mutation.target as AppTab;
			if (tab.active) {
				const index = this.tabs.indexOf(tab);
				this.setActiveTab(index);
			}
		});
	});

	private onTabsAdded() {
		this.tabObserver.disconnect();
		this.tabs.forEach((tab) => {
			this.tabObserver.observe(tab, { attributes: true, attributeFilter: ['active'] });
		});
	}

	render() {
		return html`
			<div class="container">
				<div class="tabs">
					<slot name="tab" @slotchange=${this.onTabsAdded}></slot>
				</div>
				<div class="panels">
					<slot></slot>
				</div>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-tab-group': AppTabGroup;
	}
}
