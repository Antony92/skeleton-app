import { StoreController } from '@app/controllers/store.controller';
import { $user } from '@app/shared/auth';
import { setPageTitle } from '@app/utils/html';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-profile-page')
export class AppProfilePage extends LitElement {
  static styles = [
    css`
      h3 {
        margin: 0 0 10px 0;
      }
    `,
  ];

  private userController = new StoreController(this, $user);

  connectedCallback() {
    super.connectedCallback();
    setPageTitle('Profile');
  }

  render() {
    return html`
      <h3>Profile</h3>
      ${this.userController.value?.name} - ${this.userController.value?.roles.join(', ')}
    `;
  }
}
