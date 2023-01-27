import { css } from 'lit'

export const appTableActionsBoxStyle = css`
    .actions-box {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 10px;
    }

    .actions-box sl-input {
        width: 350px;
    }

    .actions-box .clear-filters-button {
        margin-left: auto;
    }

    .actions-box .action-buttons {
        display: flex;
        gap: 10px;
    }
`

export const appTableStyle = css`
    .table {
        display: table;
        width: 100%;
        border-collapse: collapse;
    }

    .table.loading {
       pointer-events: none;
    }

    .table-wrapper {
        overflow-x: auto;
        position: relative;
    }

    .table sl-spinner {
        font-size: 3rem;
        z-index: 1;
        position: absolute;
        top: 50%;
        left: 50%;
        translate: -50% -50%;
        transition: opacity 0.3s;
        opacity: 1;
        visibility: visible;
    }

    .table sl-spinner[hidden] {
        opacity: 0;
        visibility: hidden;
    }
`