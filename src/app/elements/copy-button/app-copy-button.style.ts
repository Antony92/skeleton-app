import { css } from 'lit'

export const appCopyButtonStyle = css`
	button {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border: none;
		border-radius: var(--radius-2);
		padding: 0 10px;
		box-shadow: var(--shadow-2);
		height: 36px;
		background-color: transparent;
		color: var(--color);

		&:disabled {
			opacity: 0.5;
			box-shadow: none;
			cursor: not-allowed;
		}

		&:not(:disabled):active {
			color: color-mix(in oklab, var(--color), black 16%);
		}

		&:hover:not(:active, :disabled) {
			color: color-mix(in oklab, var(--color), black 8%);
		}

		.success {
		   color: var(--theme-success-color);
		}
	}
`
