import { css } from 'lit';

export const formStyle = css`
	form {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 15px;

		@media (min-width: 768px) {
			max-width: 350px;
		}
	}
`;
