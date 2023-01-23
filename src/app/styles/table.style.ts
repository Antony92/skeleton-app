import { css } from 'lit'

export const tableStyle = css`
    table {
        width: 100%;
        border-collapse: collapse;
    }

    table thead th,
    table tbody td {
        text-align: left;
        padding: 10px;
    }

    table thead tr th,
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