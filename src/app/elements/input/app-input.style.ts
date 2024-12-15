import { css } from 'lit'

export const appInputStyle = css`
	label {
		width: fit-content;
	}
	
	.input {
		display: flex;
		align-items: center;
		border: 1px solid var(--theme-default-color);
		width: 100%;
		border-radius: 3px;
		height: 30px;

		input {
			width: 100%;
			height: 100%;
			border: none;
			outline: none;
			background: none;
			padding: 0 10px;

			&::placeholder {
				color: var(--theme-default-color);
			}
		}

		.prefix, .suffix {
			display: flex;
			align-items: center;
		}

		.prefix ::slotted(*) {
			padding-left: 10px;
		}

		.suffix ::slotted(*) {
			padding-right: 10px;
		}

		&:has(input:disabled) {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&:has(input:focus-visible) {
			outline: 2px solid var(--theme-color);
        	border-radius: 2px;
		}

		&:hover:not(:has(input:disabled)):not(:has(input:focus-within)) {
			border-color: var(--theme-primary-color);
		}
	}
`
