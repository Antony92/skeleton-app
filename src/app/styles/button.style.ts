import { css } from 'lit'

export const createButtonStyle = css`
	.create-button {
		position: fixed;
		z-index: 1;
		right: 20px;
		bottom: 20px;
	}

	@media only screen and (max-width: 900px) {
		.create-button {
			bottom: 95px;
		}
	}
`
