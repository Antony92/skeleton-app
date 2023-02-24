import { css } from 'lit'

export const appInput = css`
    .input {
        display: flex;
        border-radius: var(--sl-input-border-radius-medium);
        font-size: var(--sl-input-font-size-medium);
        height: var(--sl-input-height-medium);
        border: none;
        background-color: var(--sl-input-filled-background-color);
        color: var(--sl-input-color);
    }

    .input input {
        flex: 1 1 auto;
        height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
        padding: 0 var(--sl-input-spacing-medium);
        color: var(--sl-input-color);
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        min-width: 0px;
        border: none;
        background: none !important;
        box-shadow: none;
        margin: 0px;
        cursor: inherit;
        appearance: none;
    }

    .input input:focus {
        outline: none;
    }

    .input:has(input:focus) {
        background-color: var(--sl-input-filled-background-color-focus);
        outline: var(--sl-focus-ring);
        outline-offset: var(--sl-focus-ring-offset);
    }
`