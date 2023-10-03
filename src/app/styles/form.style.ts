import { css } from 'lit'

export const formValidationStyle = css`
    /* user invalid styles */
    .form-validation sl-input[data-user-invalid]::part(base),
    .form-validation sl-textarea[data-user-invalid]::part(base),
    .form-validation sl-select[data-user-invalid]::part(combobox) {
        border-color: var(--sl-color-danger-600);
    }

    .form-validation [data-user-invalid]::part(form-control-label),
    .form-validation [data-user-invalid]::part(form-control-help-text) {
        color: var(--sl-color-danger-700);
    }

    .form-validation sl-input:focus-within[data-user-invalid]::part(base),
    .form-validation sl-textarea:focus-within[data-user-invalid]::part(base),
    .form-validation sl-select:focus-within[data-user-invalid]::part(combobox) {
        border-color: var(--sl-color-danger-600);
        box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-danger-300);
        outline-color: var(--sl-color-danger-600);
    }

    /* user valid styles */
    /* .form-validation sl-input[data-user-valid]::part(base),
    .form-validation sl-textarea[data-user-valid]::part(base),
    .form-validation sl-select[data-user-valid]::part(combobox) {
        border-color: var(--sl-color-success-600);
    }

    .form-validation [data-user-valid]::part(form-control-label),
    .form-validation [data-user-valid]::part(form-control-help-text) {
        color: var(--sl-color-success-700);
    }

    .form-validation sl-input:focus-within[data-user-valid]::part(base),
    .form-validation sl-textarea:focus-within[data-user-valid]::part(base),
    .form-validation sl-select:focus-within[data-user-valid]::part(combobox) {
        border-color: var(--sl-color-success-600);
        box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-color-success-300);
        outline-color: var(--sl-color-success-600); */
    }
`

export const basicFormStyle = css`
    .basic-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .form-actions {
        display: flex;
        gap: 10px;
    }

    sl-dialog .form-actions {
        justify-content: flex-end;
        margin-top: var(--footer-spacing);
    }
`