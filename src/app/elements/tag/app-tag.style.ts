import { css } from 'lit'

export const appTagStyle = css`
	button {
		padding: 6px 16px;
		border-radius: var(--radius-round);
		border: 1px solid var(--theme-muted-color);
		background: transparent;
		color: var(--theme-muted-color);
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 600;
		font-size: 0.75rem;

		&:disabled {
			cursor: not-allowed;
		}

		&.active {
			background: var(--theme-primary-background);
			color: var(--theme-color);
			border: 1px solid var(--theme-primary-color);
		}

		&:hover:not(.active, :disabled) {
			border: 1px solid var(--theme-primary-color);
			color: var(--theme-color);
		}
	}
`
