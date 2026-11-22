import { setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-audit-logs-page')
export class AppAuditLogsPage extends LitElement {
  static override styles = [
    css`
      h3 {
        margin: 0 0 10px 0;
      }
    `,
  ];

  override connectedCallback() {
    super.connectedCallback();
    setPageTitle('Audit Logs');
  }

  override render() {
    return html` <h3>Audit Logs</h3> `;
  }
}
