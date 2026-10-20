import { css } from 'lit';

export const appDrawerStyle = css`
  dialog {
    inset: 0;
    padding: 0;
    outline: 0;
    border: none;
    box-shadow: var(--shadow-2);
    background: var(--theme-default-surface);
    overflow: hidden;
    inline-size: 25rem;
    max-inline-size: 100vw;
    block-size: 100dvh;
    max-block-size: 100dvh;

    &.top,
    &.bottom {
      inline-size: 100vw;
      max-inline-size: 100vw;
      block-size: auto;
      max-block-size: 25rem;
    }

    &::backdrop {
      background: rgb(0 0 0 / 0%);
    }

    &[open] {
      inset: auto;

      &.left {
        inset: 0 auto 0 0;
      }

      &.right {
        inset: 0 0 0 auto;
      }

      &.top {
        inset: 0 0 auto 0;
      }

      &.bottom {
        inset: auto 0 0 0;
      }

      &::backdrop {
        background-color: rgb(0 0 0 / 20%);
      }
    }

    &:not([open]) {
      pointer-events: none;
    }

    .container {
      display: grid;
      grid-template-rows: auto 1fr auto;
      block-size: 100%;
      max-block-size: inherit;
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;

      h3 {
        margin: 0;
      }

      button {
        background: none;
        cursor: pointer;
        border: none;
        font-size: var(--theme-font-size);
      }
    }

    article {
      overflow-y: auto;
      overscroll-behavior-y: contain;
      display: grid;
      max-block-size: 100%;
      padding: 5px 20px;
    }

    footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 20px;
    }
  }
`;
