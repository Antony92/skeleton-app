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

	private attachedTabs = new WeakSet<AppTab>()

	protected firstUpdated() {
		const index = this.tabs.findIndex((tab) => !tab.disabled && tab.active)
		this.setActiveTab(index === -1 ? 0 : index)
	}

	private tabObserver = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			const tab = mutation.target as AppTab
			if (tab.active) {
				const index = this.tabs.findIndex((t) => t === tab)
				this.setActiveTab(index)
			}
		})
	})

	setActiveTab(index = 0) {
		const tab = this.tabs.filter((tab) => !tab.disabled).at(index)
		if (tab && !tab.active) {
			tab.active = true
		}
		const panel = this.panels.find((panel) => panel.name === tab?.panel)
		if (panel) {
			panel.active = true
		}
		this.tabs.filter((_, i) => index !== i).forEach((t) => (t.active = false))
		this.panels.filter((p) => p.name !== panel?.name).forEach((p) => (p.active = false))
	}

	private onTabsAdded() {
		this.tabObserver.disconnect()
		this.tabs.forEach((tab) => {
			this.attachTabListeners(tab)
			this.tabObserver.observe(tab, { attributes: true, attributeFilter: ['active'] })
		})
	}

	private attachTabListeners(tab: AppTab) {
		if (this.attachedTabs.has(tab)) {
			return
		}
		this.attachedTabs.add(tab)
		tab.addEventListener('click', (event) => {
			if (event.defaultPrevented) {
				return
			}
			tab.active = true
			this.dispatchEvent(new AppTabChangeEvent(tab.panel))
		})
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
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-tab-group': AppTabGroup
	}
}
