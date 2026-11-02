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

            td[data-sticky],
            td[data-stickyend] {
              background: var(--theme-primary-color);
            }
          }

          &:hover:not(.active) {
            background: var(--theme-default-color);

            td[data-sticky],
            td[data-stickyend] {
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
        font-size: 0.85rem;

        &[data-action] {
          width: var(--action-width, 1%);
        }

        &[data-sticky] {
          position: sticky;
          left: var(--sticky-start, -1px);
          z-index: 2;
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

        &[data-textlimit] {
          max-width: var(--textlimit, 300px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &[data-textwrap] {
          white-space: normal;
        }

        &[data-sticky] {
          position: sticky;
          left: var(--sticky-start, -1px);
          z-index: 1;
          background: var(--theme-background);

          &:has(sl-dropdown[open]) {
            z-index: 3;
          }
        }
      }
    }
  }
`;
