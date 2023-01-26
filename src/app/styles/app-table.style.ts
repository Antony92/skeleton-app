import { css } from 'lit'

export const appTableActionsBoxStyle = css`
    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 10px;
    }

    .actions sl-input {
        width: 350px;
    }

    .actions sl-button {
        margin-left: auto;
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
        opacity: 0;
    }

    .table.loading sl-spinner {
        opacity: 1;
    }
`