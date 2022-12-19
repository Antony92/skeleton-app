import { css } from 'lit'

export const tableStyle = css`
    table {
        width: 100%;
        border-collapse: collapse;
    }

    table thead th,
    table tbody td {
        text-align: left;
        border-bottom: 1px solid grey;
        padding: 10px;
    }

    table tbody td.limit-text {
        max-width: 300px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    table thead th.sortable {
        cursor: pointer;
    }

    table thead th.sortable sl-icon {
        position: relative;
        top: 3px;
    }
`