import { css } from 'lit'

export const appTableStyle = css`
	app-table table {
		width: 100%;
		border-collapse: collapse;
	}

	app-table table tbody tr:not(:last-child) {
		border-bottom: 1px solid grey;
	}

	app-table table tbody tr:first-child {
		border-top: 1px solid grey;
	}

	app-table table th {
		white-space: nowrap;
		vertical-align: bottom;
		text-align: justify;
		padding: 10px;
	}

	app-table table th[action] {
		width: var(--action-width, 1%);
	}

	app-table table th[sticky] {
		position: sticky;
		left: var(--sticky-start, -1px);
		z-index: 1;
		background-color: var(--theme-background);
	}

	app-table table th[stickyend] {
		position: sticky;
		right: var(--sticky-end, -1px);
		z-index: 1;
		background-color: var(--theme-background);
	}

	app-table table td {
		white-space: nowrap;
		padding: 10px 20px;
	}

	app-table table td[textlimit] {
		max-width: var(--textlimit, 300px);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	app-table table td[textwrap] {
		white-space: normal;
	}

	app-table table td[sticky] {
		position: sticky;
		left: var(--sticky-start, -1px);
		z-index: 1;
		background-color: var(--theme-background);
	}

	app-table table td[stickyend] {
		position: sticky;
		right: var(--sticky-end, -1px);
		z-index: 1;
		background-color: var(--theme-background);
	}

    app-table table td[sticky]:has(sl-dropdown[open]) {
        z-index: 2;
    }
`
