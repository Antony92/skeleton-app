import { appDrawerStyle } from '@app/elements/drawer/app-drawer.style';
import { defaultStyle } from '@app/styles/default.style';
import { focusStyle } from '@app/styles/focus.style';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

@customElement('app-drawer')
export class AppDrawer extends LitElement {
	static styles = [
		defaultStyle,
		appDrawerStyle,
		focusStyle,
		css`
			:host {
				display: none;
			}

			:host([open]) {
				display: block;
			}
		`,
	];

	@property({ type: String })
	accessor header = '';

	@property({ type: Boolean, reflect: true })
	accessor open = false;

	@property({ type: Boolean })
	accessor modal = false;

	@property({ type: String })
  accessor position: 'top' | 'left' | 'right' | 'bottom' = 'left';

  @property({ type: Boolean, attribute: 'show-hide' })
	accessor showHide = true;

	@query('dialog')
	accessor dialog!: HTMLDialogElement;

	protected firstUpdated() {
		this.dialog.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (!target) return;

			if (target.hasAttribute('app-drawer-close')) {
				this.hide();
				return;
			}

			if (target instanceof HTMLDialogElement === false) {
				return;
			}

			if (this.modal) {
				this.pulseAnimation();
			} else {
				this.hide();
			}
		});

		this.dialog.addEventListener('cancel', (event) => {
			event.preventDefault();
			this.hide();
		});
	}

	async show(position?: 'top' | 'left' | 'right' | 'bottom') {
		if (!this.dispatchEvent(new Event('app-show', { cancelable: true }))) {
			return;
		}
		if (position) this.position = position;
		this.open = true;
		await this.updateComplete;
		this.dialog.showModal();
		await this.openAnimation();
		this.querySelector<HTMLElement>('[autofocus]')?.focus();
		this.dispatchEvent(new Event('app-after-show'));
	}

	async hide() {
		if (!this.dispatchEvent(new Event('app-hide', { cancelable: true }))) {
			return;
		}
		await this.updateComplete;
		await this.openAnimation(true);
		this.dialog.close();
		this.open = false;
		this.dispatchEvent(new Event('app-after-hide'));
	}

	openAnimation(reverse = false) {
		let translateFrom = 'translate3d(-100%, 0, 0)'; // default 'left'

		if (this.position === 'right') {
			translateFrom = 'translate3d(100%, 0, 0)';
		} else if (this.position === 'top') {
			translateFrom = 'translate3d(0, -100%, 0)';
		} else if (this.position === 'bottom') {
			translateFrom = 'translate3d(0, 100%, 0)';
		}

		const animation = this.dialog.animate(
			[
				{ transform: translateFrom, opacity: 0 },
				{ transform: 'translate3d(0, 0, 0)', opacity: 1 },
			],
			{
				direction: reverse ? 'reverse' : 'normal',
				duration: 250,
				easing: reverse ? 'cubic-bezier(0.4, 0, 1, 1)' : 'cubic-bezier(0.16, 1, 0.3, 1)',
				fill: 'both',
			},
		);
		return animation.finished;
	}

	pulseAnimation() {
		const animation = this.dialog.animate([{ scale: 1 }, { scale: 1.01 }, { scale: 1 }], {
			duration: 250,
			fill: 'both',
		});
		return animation.finished;
	}

	render() {
		return html`
			<dialog class="${this.position}">
				<div class="container">
					<header>
						<slot name="header">
							<h3>${this.header}</h3>
						</slot>
						${when(this.showHide, () => html`<button class="focus-visible" @click=${this.hide}>✕</button>`)}
					</header>
					<article>
						<slot></slot>
					</article>
					<footer>
						<slot name="footer"></slot>
					</footer>
				</div>
			</dialog>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'app-drawer': AppDrawer;
	}
}
