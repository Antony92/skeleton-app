import { css } from 'lit';

export const appChipStyle = css`
	div {
		display: flex;
		align-items: center;
		position: relative;

		button.chip {
			padding: 6px 12px;
			border-radius: var(--radius-round);
			border: 1px solid var(--theme-muted-color);
			background: transparent;
			color: var(--theme-muted-color);
			cursor: pointer;
			transition-property: background, border-color, color;
			transition-duration: var(--transition-fast);
			transition-timing-function: var(--transition-easing);
			transform-origin: center center;
			font-weight: 600;
			font-size: 0.75rem;

			&:disabled {
				cursor: not-allowed;
			}

			&.active {
				background: var(--theme-primary-background);
				color: var(--theme-white-color);
				border: 1px solid var(--theme-primary-color);
			}

			&:hover:not(.active, :disabled) {
				border: 1px solid var(--theme-primary-color);
				color: var(--theme-color);
			}

			&.removable {
				padding: 6px 28px 6px 12px;
			}
		}

		.remove {
			background: none;
			border: none;
			cursor: pointer;
			padding: 0;
			color: var(--theme-color);
			position: absolute;
			right: 12px;
			top: 50%;
			transform: translateY(-50%);
		}
	}
`;
