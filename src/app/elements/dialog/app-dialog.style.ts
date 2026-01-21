import { css } from 'lit'

export const appDialogStyle = css`
	dialog {
		inset: 0;
		padding: 0;
		outline: 0;
		inline-size: min(90vw, 60ch);
		max-block-size: min(80vh, 100%);
		overflow: hidden;
		border: none;
		box-shadow: var(--shadow-2);
		border-radius: var(--radius-2);
		background-color: var(--theme-default-layer);

		&::backdrop {
			background: rgb(0 0 0 / 0%);
			/* transition: background-color 200ms ease; */
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
			max-block-size: 70vh;
		}

		header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 15px;

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
			max-block-size: 100%;
			padding: 5px 15px;
		}

		footer {
			display: flex;
			justify-content: flex-end;
			gap: 10px;
			padding: 15px;
		}
	}
`
