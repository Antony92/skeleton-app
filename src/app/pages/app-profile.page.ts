import { getUser } from '@app/shared/auth';
import type { User } from '@app/types/user.type';
import { setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { pageStyle } from '@app/styles/page.style';

@customElement('app-profile-page')
export class AppProfilePage extends LitElement {
  static override styles = [
    pageStyle,
    css`
      h3 {
        margin: 0 0 10px 0;
      }
    `,
  ];

  user: User | null = null;

  override connectedCallback() {
    super.connectedCallback();
    setPageTitle('Profile');
    this.user = getUser();
  }

  override render() {
    return html`
      <h3>Profile</h3>
      ${this.user?.name} - ${this.user?.roles.join(', ')}
    `;
  }
}
