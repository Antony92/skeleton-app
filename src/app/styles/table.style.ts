import { css } from 'lit'

export const tableWrapperStyle = css`
    .table-wrapper {
        overflow-x: auto;
    }
`

export const tableStyle = css`
    table {
        width: 100%;
        border-collapse: collapse;
    }

    table thead th {
        text-align: left;
        padding: 5px 10px;
    }

    table tbody td {
        text-align: left;
        padding: 10px;
    }

    table tbody tr:not(:last-child) td {
        border-bottom: 1px solid grey;
    }

    table tbody td.limit-text {
        max-width: 300px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`