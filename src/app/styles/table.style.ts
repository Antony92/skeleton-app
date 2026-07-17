import { css } from 'lit';

export const tableStyle = css`
	table {
		width: 100%;
		border-collapse: collapse;
		position: relative;

		&.hoverable {
      tbody {
        tr {

          &.active {
            background: var(--theme-primary-color);

            td[sticky], td[stickyend] {
              background: var(--theme-primary-color);
            }
          }

          &:hover:not(.active) {
            background: var(--theme-default-color);

            td[sticky], td[stickyend] {
              background: var(--theme-default-color);
            }
          }
        }
      }
    }

		thead {
			th {
				white-space: nowrap;
				vertical-align: bottom;
				text-align: justify;
				padding: 10px;

				&[action] {
					width: var(--action-width, 1%);
				}

				&[sticky] {
					position: sticky;
					left: var(--sticky-start, -1px);
					z-index: 1;
					background: var(--theme-background);
				}

				&[stickyend] {
					position: sticky;
					right: var(--sticky-end, -1px);
					z-index: 1;
					background: var(--theme-background);
				}
			}
		}

		tbody {
			tr:first-child {
				border-top: 1px solid grey;
			}

			tr:not(:last-child) {
				border-bottom: 1px solid grey;
			}

			td {
				white-space: nowrap;
				padding: 10px;

				&[textlimit] {
					max-width: var(--textlimit, 300px);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				&[textwrap] {
					white-space: normal;
				}

				&[sticky] {
					position: sticky;
					left: var(--sticky-start, -1px);
					z-index: 1;
					background: var(--theme-background);

					&:has(sl-dropdown[open]) {
						z-index: 2;
					}
				}

				&[stickyend] {
					position: sticky;
					right: var(--sticky-end, -1px);
					z-index: 1;
					background: var(--theme-background);

					&:has(sl-dropdown[open]) {
						z-index: 2;
					}
				}
			}
		}
	}
`;
