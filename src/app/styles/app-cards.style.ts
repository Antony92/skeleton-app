import { css } from 'lit'

export const appCardsStyle = css`
	.container {
		display: grid;
  		grid-template-columns: repeat(auto-fit, 350px);
		grid-gap: 1rem;
	}

	sl-card {
		max-width: 350px;
	}

	sl-card img {
		background: #d4d4d8;
		height: 200px;
	}

	sl-card [slot='footer'] {
		display: flex;
		align-items: center;
		gap: 10px;
		justify-content: flex-end;
	}

	sl-card small {
		color: var(--sl-color-neutral-500);
	}

	@media only screen and (max-width: 900px) {
		.container {
			justify-content: center;
		}
	}
`
