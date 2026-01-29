import { getRouteParams } from '@app/shared/navigation'
import { setPageTitle } from '@app/utils/html'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('app-test-page')
export class AppTestPage extends LitElement {
	static styles = [
		css`
			h3 {
				margin: 0 0 10px 0;
			}
		`,
  ]

  pageId = ''

	connectedCallback() {
    super.connectedCallback()
    setPageTitle(`Test page`)
    const { id } = getRouteParams()
		this.pageId = id || ''
	}

	render() {
		return html`
			<h3>Test Page ${this.pageId}</h3>
		`
	}
}
