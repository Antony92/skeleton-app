import { css } from 'lit';

export const appTagStyle = css`
  div {
    padding: 6px 16px;
    border-radius: var(--radius-1);
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--color);
    font-weight: 600;
    font-size: 0.75rem;
    display: flex;
    gap: 5px;
    align-items: center;
    height: 1.8rem;

    &.removable {
      padding: 6px 10px 6px 12px;
    }

    &.pill {
      border-radius: var(--radius-round);
    }

    .remove {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      color: var(--theme-color);
    }
  }

  :host([variant='primary']) {
    --background: color-mix(in srgb, var(--theme-primary-background) 10%, transparent);
    --color: var(--theme-primary-color);
    --border: var(--theme-primary-color);
  }

  :host([variant='success']) {
    --background: color-mix(in srgb, var(--theme-success-background) 10%, transparent);
    --color: var(--theme-success-color);
    --border: var(--theme-success-color);
  }

  :host([variant='warning']) {
    --background: color-mix(in srgb, var(--theme-warning-background) 10%, transparent);
    --color: var(--theme-warning-color);
    --border: var(--theme-warning-color);
  }

  :host([variant='error']) {
    --background: color-mix(in srgb, var(--theme-error-background) 10%, transparent);
    --color: var(--theme-error-color);
    --border: var(--theme-error-color);
  }
`;
