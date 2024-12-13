import { css } from 'lit'

export const appDialogStyle = css`
	dialog {
		inset: 0;
		padding: 0;
		max-inline-size: min(90vw, 60ch);
		max-block-size: min(80vh, 100%);
		overflow: hidden;
		border: none;
		box-shadow: var(--shadow-2);
		border-radius: var(--radius-2);
		background-color: var(--theme-default-layer);
		color: var(--theme-color);

		&::backdrop {
			background: rgb(0 0 0 / 0%);
			transition: background-color 200ms ease;
		}

		&[open] {

			&::backdrop {
				background-color: rgb(0 0 0 / 20%);
			}
		}

		&:not([open]) {
			pointer-events: none;
		}

		.container {
			display: grid;
			grid-template-rows: auto 1fr auto;
			row-gap: 10px;
			align-items: start;
			max-block-size: 80vh;
			padding: 15px;
		}

		header {
			display: flex;
			align-items: center;
			justify-content: space-between;

			h3 {
				margin: 0;
			}

			button {
				background: none;
				cursor: pointer;
				border: none;
			}
		}

		article {
			overflow-y: auto;
			overscroll-behavior-y: contain;
			display: grid;
			justify-items: flex-start;
			max-block-size: 100%;
		}

		footer {
			display: flex;
			justify-content: flex-end;
		}
	}
`
