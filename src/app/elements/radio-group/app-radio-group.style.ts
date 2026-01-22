import { css } from 'lit'

export const appRadioGroupStyle = css`
	:host(:state(user-invalid)) {
		.form-control {
			legend {
				color: var(--theme-invalid-color);
			}
		}
	}

	:host([required]) {
		legend::after {
			content: ' *';
			color: var(--theme-invalid-color);
		}
	}

	.form-control {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 5px;

		fieldset {
			border: none;
			padding: 0;
			display: flex;
			flex-direction: column;
			gap: 5px;

			legend {
				padding: 0;
				margin-bottom: 5px;
			}
		}

		small {
			color: var(--theme-invalid-color);
		}
	}
`
