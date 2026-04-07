import { setPageTitle } from '@app/utils/html'
import { html, LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'

@customElement('app-drag-drop-page')
export class AppDragDropPage extends LitElement {
	static styles = [
		css`
			.items {
				display: flex;
				flex-direction: column;
				gap: 10px;

				.item {
					display: flex;
					align-items: center;
					gap: 10px;
					border: 2px solid gray;
					border-radius: var(--radius-2);
					padding: 10px;

					&.dragged {
						opacity: 0.4;
					}

					&.over {
						border: 2px dotted gray;
						background: var(--theme-muted-background);

						* {
							pointer-events: none;
						}
					}

					app-icon {
						cursor: grab;
					}

					h3 {
						margin: 0;
					}

					span {
						margin-left: auto;
						background: var(--theme-primary-background);
						border-radius: var(--radius-2);
						padding: 5px 10px;
					}
				}
			}
		`,
	]

	draggedItemIndex = 0

	items = [
		{ id: crypto.randomUUID(), title: 'Item 1' },
		{ id: crypto.randomUUID(), title: 'Item 2' },
		{ id: crypto.randomUUID(), title: 'Item 3' },
		{ id: crypto.randomUUID(), title: 'Item 4' },
	]

	connectedCallback() {
		super.connectedCallback()
		setPageTitle('Drag & Drop Demo')
	}

	handleDragStart(event: DragEvent, draggedItemIndex: number) {
		if (!event.dataTransfer) {
			return
		}
		const target = event.target as HTMLElement
		target.classList.add('dragged')

		this.draggedItemIndex = draggedItemIndex

		event.dataTransfer.effectAllowed = 'move'
		event.dataTransfer.setData('text/html', draggedItemIndex.toString())
	}

	handleDragOver(event: DragEvent) {
		event.preventDefault()
		if (!event.dataTransfer) {
			return
		}
		event.dataTransfer.dropEffect = 'move'
	}

	handleDragEnter(event: DragEvent) {
		event.stopPropagation()
		const target = event.target as HTMLElement
		target.closest('.item')?.classList.add('over')
	}

	handleDragLeave(event: DragEvent) {
		event.stopPropagation()
		const target = event.target as HTMLElement
		target.closest('.item')?.classList.remove('over')
	}

	handleDrop(event: DragEvent) {
		event.stopPropagation()

		const target = event.target as HTMLElement
		const dropIndex = Number(target.dataset.index)

		const draggedItem = this.items.splice(this.draggedItemIndex, 1).at(0)
		if (draggedItem) {
			this.items.splice(dropIndex, 0, draggedItem)
			this.requestUpdate()
		}
	}

	handleDragEnd(event: DragEvent) {
		const target = event.target as HTMLElement
		target.classList.remove('dragged')
		this.renderRoot.querySelectorAll('.item').forEach((item) => {
			item.classList.remove('over')
			item.removeAttribute('draggable')
		})
  }

  handleMouseDown(event: MouseEvent) {
		(event.target as HTMLElement).closest('.item')?.setAttribute('draggable', 'true')
  }

  handleMouseUp(event: MouseEvent) {
    (event.target as HTMLElement).closest('.item')?.removeAttribute('draggable')
	}

	protected firstUpdated() {}

	render() {
		return html`
			<div class="items">
				${repeat(
					this.items,
					(item) => item.id,
					(item, index) => html`
						<div
							class="item"
							data-index=${index}
							@dragstart=${(event: DragEvent) => this.handleDragStart(event, index)}
							@dragenter=${this.handleDragEnter}
							@dragleave=${this.handleDragLeave}
							@dragover=${this.handleDragOver}
							@dragend=${this.handleDragEnd}
							@drop=${this.handleDrop}
						>
							<app-icon
								class="handle"
								@mousedown=${this.handleMouseDown}
								@mouseup=${this.handleMouseUp}
							>
								drag_indicator
							</app-icon>
							<h3>${item.title}</h3>
							<span>${index + 1}</span>
						</div>
					`,
				)}
			</div>
		`
	}
}
