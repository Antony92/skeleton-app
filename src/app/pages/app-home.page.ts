import { setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@app/elements/tab/app-tab.element';
import '@app/elements/tab-group/app-tab-group.element';
import '@app/elements/tab-panel/app-tab-panel.element';

@customElement('app-home-page')
export class AppHomePage extends LitElement {
	static styles = [
		css`
			img {
				display: block;
				width: 100%;
				height: 100%;
			}

			h3 {
				margin: 0 0 10px 0;
			}
		`,
	];

	connectedCallback() {
		super.connectedCallback();
		setPageTitle('Home');
	}

	protected firstUpdated() {}

	render() {
		return html` <app-tab-group>
			<app-tab slot="tab" panel="general" active>General</app-tab>
			<app-tab slot="tab" panel="custom">Custom</app-tab>
			<app-tab slot="tab" panel="advanced">Advanced</app-tab>
			<app-tab slot="tab" panel="disabled" disabled>Disabled</app-tab>
			<app-tab slot="tab" panel="general" active>General</app-tab>
			<app-tab slot="tab" panel="custom">Custom</app-tab>
			<app-tab slot="tab" panel="advanced">Advanced</app-tab>
			<app-tab slot="tab" panel="disabled" disabled>Disabled</app-tab>

			<app-tab-panel name="general">This is the general tab panel.</app-tab-panel>
			<app-tab-panel name="custom">This is the custom tab panel.</app-tab-panel>
			<app-tab-panel name="advanced">This is the advanced tab panel.</app-tab-panel>
			<app-tab-panel name="disabled">This is a disabled tab panel.</app-tab-panel>
		</app-tab-group>`;
	}
}
