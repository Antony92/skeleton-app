import { css } from 'lit'

export const appTableFilterBoxStyle = css`
    .filter-box {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .filter-box sl-input {
        width: 350px;
    }
`

export const appTableWrapperStyle = css`
    .table-wrapper {
        overflow-x: auto;
        position: relative;
    }
`

export const appTableLoaderStyle = css`
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

export const appTableStyle = css`
    .table {
        display: table;
        width: 100%;
        border-collapse: collapse;
    }
`