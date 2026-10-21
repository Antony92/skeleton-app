import { whenUserRole } from '@app/directives/when-user-role.directive';
import { appSidebarStyle } from '@app/elements/sidebar/app-sidebar.style';
import { Role } from '@app/types/user.type';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import '@app/elements/icon/app-icon.element';
import { defaultStyle } from '@app/styles/default.style';

@customElement('app-sidebar')
export class AppSidebar extends LitElement {
  static styles = [defaultStyle, appSidebarStyle, css``];

  @state()
  private accessor currentPath = location.pathname;

  connectedCallback() {
    super.connectedCallback();
    navigation.addEventListener('currententrychange', this.setActiveLink);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    navigation.removeEventListener('currententrychange', this.setActiveLink);
  }

  setActiveLink = (event: Event) => {
    const target = event.target as Navigation;
    if (target.currentEntry?.url) {
      this.currentPath = new URL(target.currentEntry.url).pathname;
    }
  };

  render() {
    return html`
      <aside>
        <ul>
          <li>
            <a href="/home" class=${classMap({ active: this.currentPath.includes('/home') })}>
              <span>
                <app-icon class="icon" filled>home</app-icon>
              </span>
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="/demo" class=${classMap({ active: this.currentPath.includes('/demo') })}>
              <span>
                <app-icon class="icon" filled>skull</app-icon>
              </span>
              <span>Demo</span>
            </a>
          </li>
          <li>
            <a href="/form" class=${classMap({ active: this.currentPath.includes('/form') })}>
              <span>
                <app-icon class="icon" filled>list_alt</app-icon>
              </span>
              <span>Form</span>
            </a>
          </li>
          <li>
            <a href="/table" class=${classMap({ active: this.currentPath.includes('/table') })}>
              <span>
                <app-icon class="icon" filled>table</app-icon>
              </span>
              <span>Table</span>
            </a>
          </li>
          <li>
            <a href="/test/1" class=${classMap({ active: this.currentPath.includes('/test') })}>
              <span>
                <app-icon class="icon" filled>unknown_document</app-icon>
              </span>
              <span>Page</span>
            </a>
          </li>
          ${whenUserRole(
            [Role.ADMIN],
            () => html`
              <li class="bottom" hide-on-mobile>
                <a href="/admin" class=${classMap({ active: this.currentPath.includes('/admin') })}>
                  <span>
                    <app-icon class="icon" filled>admin_panel_settings</app-icon>
                  </span>
                  <span>Admin</span>
                </a>
              </li>
            `,
          )}
        </ul>
      </aside>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-sidebar': AppSidebar;
  }
}
