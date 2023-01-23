import { css } from 'lit'

export const tableWrapperStyle = css`
    .table-wrapper {
        overflow-x: auto;
        position: relative;
    }
`

export const tableLoaderStyle = css`
    .table-loader {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        visibility: visible;
        opacity: 1;
        transition: all 0.3s;
    }

    .table-loader sl-spinner {
        font-size: 3rem;
    }

    .table-loader[hidden] {
        opacity: 0;
        visibility: hidden;
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

    table thead th.sortable {
        cursor: pointer;
    }

    table thead th.sortable sl-icon {
        position: relative;
        top: 3px;
    }

    table thead :is(sl-input, sl-select) {
        min-width: 200px;
    }
`