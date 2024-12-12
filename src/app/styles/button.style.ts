import { css } from 'lit'

export const buttonStyle = css`
	button {
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 5px;
		border: none;
		border-radius: var(--radius-2);
		padding: 10px;
		font-weight: var(--font-weight-6);
		box-shadow: var(--shadow-2);

		&:focus-visible {
			outline: 2px solid black;
			border-radius: 2px;
			outline-offset: 2px;
		}

		&.only-icon {
			background: none;
			border: none;
			padding: 0;
		}

		&.primary {
			background-color: var(--blue-8);

			&:hover {
				background-color: var(--blue-9);
			}
		}

		&.success {
			background-color: var(--blue-8);

			&:hover {
				background-color: var(--blue-9);
			}
		}

		&.error {
			background-color: var(--blue-8);

			&:hover {
				background-color: var(--blue-9);
			}
		}

		&.warning {
			background-color: var(--blue-8);

			&:hover {
				background-color: var(--blue-9);
			}
		}
	}
`
