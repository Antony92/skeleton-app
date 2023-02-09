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
`