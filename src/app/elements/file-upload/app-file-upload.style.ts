import { css } from 'lit';

export const appFileUploadStyle = css`
	:host(:state(user-invalid)) {
		.form-control {
			.file-upload-wrapper {
				outline-color: var(--theme-invalid-color);
				border-color: var(--theme-invalid-color);

				&:hover {
					border-color: var(--theme-invalid-color);
				}
			}

			label {
				color: var(--theme-invalid-color);
			}
		}
	}

	.form-control {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 5px;

		label {
			width: fit-content;
		}

		small {
			color: var(--theme-invalid-color);
		}

		&:has(input[required]) {
			label::after {
				content: " *";
				color: var(--theme-invalid-color);
			}
		}

		.file-upload-wrapper {
			display: flex;
			align-items: center;
			border: 2px dotted var(--theme-default-color);
			padding: 10px;
			gap: 10px;
			border-radius: var(--radius-2);
			transition-property: border-color, outline;
			transition-duration: var(--transition-fast);
			transition-timing-function: var(--transition-easing);
			transform-origin: center center;

			&:has(input:disabled) {
				opacity: 0.5;
				cursor: not-allowed;
			}

			&:has(input:focus-visible) {
				outline: 2px solid var(--theme-color);
			}

			&:hover:not(:has(input:disabled, input:focus-within)) {
				border-color: var(--theme-primary-color);
			}
		}
	}

	ul {
		padding: 0;
		margin: 10px 0 0 0;
		list-style: none;

		li {
			display: flex;
			align-items: center;
			padding: 10px;
			border-radius: var(--radius-2);
			border: 1px solid var(--theme-default-color);
			gap: 10px;

			&:not(:last-of-type) {
				margin-bottom: 10px;
			}

			.preview {
				width: 50px;
				height: 50px;
				border-radius: var(--radius-1);
				background: var(--theme-default-color);
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.65rem;
				font-weight: 600;
				text-align: center;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}

			.details {
				display: flex;
				flex-direction: column;
				gap: 5px;

				small {
					color: var(--theme-muted-color);
				}
			}

			button {
				background: none;
				border: none;
				color: var(--theme-muted-color);
				cursor: pointer;
				font-size: 1rem;
				margin-left: auto;
			}
		}
	}
`;
