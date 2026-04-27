import { css } from 'lit'

export const appRichTextEditorStyle = css`
	:host(:state(user-invalid)) {
		.form-control {
			.editor-wrapper {
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
			font-size: 0.9rem;
		}

		small {
			color: var(--theme-invalid-color);
		}

		&:has(textarea[required]) {
			label::after {
				content: ' *';
				color: var(--theme-invalid-color);
			}
		}

		.editor-wrapper {
			display: flex;
			flex-direction: column;
			background: var(--theme-default-surface);
			border: 1px solid var(--theme-default-color);
			border-radius: var(--radius-2);

			.toolbar {
				display: flex;
				gap: 5px;
				border-bottom: 1px solid var(--theme-default-color);
			}

			.editor {
				font-family: var(--theme-font-family);
				font-size: var(--theme-font-size-1);
				overflow: auto;
				padding: 0 10px;
				max-height: 165px;

				.tiptap {
					outline: none;
					height: 100%;
					min-height: 150px;

					p.is-editor-empty:first-child::before {
						color: var(--theme-muted-color);
						content: attr(data-placeholder);
						float: left;
						height: 0;
						pointer-events: none;
					}
				}
			}

			&:has(.tiptap:focus-visible) {
				outline: 2px solid var(--theme-color);
			}

			&:hover:not(:disabled, :focus-within) {
				border-color: var(--theme-primary-color);
			}

			&:has(textarea:disabled) {
				opacity: 0.5;
				cursor: not-allowed;
				pointer-events: none;
			}
		}
	}
`
