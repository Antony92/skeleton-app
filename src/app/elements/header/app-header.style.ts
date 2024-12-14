import { css } from 'lit'

export const appHeaderStyle = css`
	header {
		display: flex;
		gap: 10px;
		align-items: center;
		height: 60px;
		padding: 0 10px;
		box-shadow: var(--shadow-1);
		background-color: var(--theme-header-background);
		transition: background-color 300ms ease-in-out;
	}

	.spacer {
		flex-grow: 1;
	}

	.title {
		margin-left: 5px;
	}

	.logo {
		width: 40px;
	}

	.avatar {
		cursor: pointer;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		background-color: var(--theme-primary-background);
		color: var(--theme-white-color);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: var(--shadow-1);
	}
`
