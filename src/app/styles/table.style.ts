import { css } from 'lit';

export const tableStyle = css`
  :host {
    max-width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    position: relative;

    &.hoverable {
      tbody {
        tr {
          &.active {
            background: var(--theme-primary-color);

            td.frozen {
              background: var(--theme-primary-color);
            }
          }

          &:hover:not(.active) {
            background: var(--theme-default-color);

            td.frozen {
              background: var(--theme-default-color);
            }
          }
        }
      }
    }

    &.clamp {
      tbody {
        td {
          vertical-align: top;
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
        vertical-align: middle;

        &[data-action] {
          width: var(--action-width, 1%);
        }

        &[data-frozen] {
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

        &[data-action] {
          text-align: center;
        }

        &[data-textwrap] {
          white-space: normal;
        }

        span[data-clamp] {
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: block;
          overflow: hidden;
          white-space: normal;

          &[data-clamp-active] {
            display: -webkit-box;
          }

          + button[data-clamp-button] {
            margin-top: 5px;
          }
        }

        button[data-clamp-button] {
          border: none;
          background: none;
          color: var(--theme-primary-color);
          cursor: pointer;
          font-size: var(--theme-font-size-1);
          font-weight: 600;
          padding: 0;
        }

        &.frozen {
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
