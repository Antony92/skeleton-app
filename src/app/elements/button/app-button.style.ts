import { css } from 'lit';

export const appButtonStyle = css`
	button,
	a {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border: none;
		border-radius: var(--radius-2);
		padding: 0 10px;
		box-shadow: var(--shadow-2);
		white-space: nowrap;
		height: 36px;
		background-color: var(--background);
		color: var(--color);
		font-family: var(--theme-font-family);
		font-size: var(--theme-font-size-1);
    font-weight: 600;
		text-decoration: none;
		transition-property: background-color, color;
    transition-duration: var(--transition-fast);
    transition-timing-function: var(--transition-easing);
    transform-origin: center center;

    &.small {
      height: auto;
    }

		&:disabled {
			opacity: 0.5;
			box-shadow: none;
			cursor: not-allowed;
		}

		&:not(:disabled):active {
			background-color: color-mix(in oklab, var(--background), black 16%);
		}

		&:hover:not(:active, :disabled) {
			background-color: color-mix(in oklab, var(--background), black 8%);
		}
	}

	:host([variant='primary']) {
		--background: var(--theme-primary-background);
		--color: var(--theme-white-color);
	}

	:host([variant='success']) {
		--background: var(--theme-success-background);
		--color: var(--theme-white-color);
	}

	:host([variant='warning']) {
		--background: var(--theme-warning-background);
		--color: var(--theme-white-color);
	}

	:host([variant='error']) {
		--background: var(--theme-error-background);
		--color: var(--theme-white-color);
	}

	:host([appearance='plain']) {
		button,
		a {
			box-shadow: none;
			background-color: transparent;
			color: var(--background);

			&:not(:disabled):active {
				color: color-mix(in oklab, var(--background), black 16%);
			}

			&:hover:not(:active, :disabled) {
				color: color-mix(in oklab, var(--background), black 8%);
			}
		}
	}

	:host([appearance='outlined']) {
		button,
		a {
			box-shadow: none;
			background-color: transparent;
			border: 1px solid var(--background);
			color: var(--background);

			&:not(:disabled):active {
				background-color: color-mix(in oklab, var(--background), var(--theme-background) 75%);
			}

			&:hover:not(:active, :disabled) {
				background-color: color-mix(in oklab, var(--background), var(--theme-background) 80%);
			}
		}
	}

	:host(:not([appearance='plain'])) {
		::slotted(app-icon) {
			font-size: 20px;
		}
	}

	:host([loading]) {
		button {
			position: relative;

			&:disabled {
				opacity: 1;
				cursor: wait;
			}
		}

		slot {
			visibility: hidden;
		}
	}

	.loader {
    --color-1: var(--theme-white-color);
    --color-2: var(--theme-black-color);
    --size: 0.025rem;
    width: calc(48 * var(--size));
    height: calc(48 * var(--size));
    border: calc(5 * var(--size)) solid var(--color-1);
    border-bottom-color: var(--color-2);
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    position: absolute;
    transform: translate(-50%, -50%);
	}

	@keyframes rotation {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
	}
`;
