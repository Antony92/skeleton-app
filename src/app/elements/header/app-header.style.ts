import { css } from 'lit'

export const appHeaderStyle = css`
	header {
		display: flex;
		gap: 10px;
		align-items: center;
		height: 60px;
		padding: 0 5px;
		box-shadow: var(--shadow-1);
		background-color: light-dark(var(--light-theme-header), var(--dark-theme-header));
		transition: background-color 300ms ease-in-out;
	}

	.spacer {
		flex-grow: 1;
	}

	.title {
		margin-left: 5px;
	}

	.logo {
		margin-left: 10px;
		width: 40px;
	}

	.avatar {
		cursor: pointer;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		background: var(--blue-8);
		display: flex;
		align-items: center;
		justify-content: center;
	}
`
