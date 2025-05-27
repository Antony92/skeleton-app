import { html, LitElement, css } from 'lit'
import { customElement, queryAssignedElements } from 'lit/decorators.js'
import type { AppTab } from '@app/elements/tab/app-tab.element'
import type { AppTabPanel } from '@app/elements/tab-panel/app-tab-panel.element'
import { AppTabChangeEvent } from '@app/events/tab.event'

@customElement('app-tab-group')
export class AppTabGroup extends LitElement {
	static styles = [
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
	]

	@queryAssignedElements({ slot: 'tab' })
	tabs!: AppTab[]

	@queryAssignedElements()
	panels!: AppTabPanel[]

	protected firstUpdated() {
		const activeTab = this.tabs.filter((tab) => !tab.disabled).find((tab) => tab.active) || this.tabs[0]
		if (activeTab) {
			activeTab.active = true
		}
		const activePanel = this.panels.find((panel) => panel.name === activeTab?.panel)
		if (activePanel) {
			activePanel.active = true
		}
		this.tabs.forEach((tab) =>
			tab.addEventListener('click', (event: Event) => {
				if (event.defaultPrevented) {
					return
				}
				tab.active = true
				const panel = this.panels.find((p) => p.name === tab.panel)
				if (panel) {
					panel.active = true
				}
				this.tabs.filter((t) => t.panel !== tab.panel).forEach((t) => (t.active = false))
				this.panels.filter((p) => p.name !== tab.panel).forEach((p) => (p.active = false))
				this.dispatchEvent(new AppTabChangeEvent(tab.panel))
			})
		)
	}

	render() {
		return html`
			<div class="container">
				<div class="tabs">
					<slot name="tab"></slot>
				</div>
				<div class="panels">
					<slot></slot>
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-tab-group': AppTabGroup
	}
}
