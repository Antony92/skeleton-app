import { render } from 'lit'

export const loading = async (show = false) => {
	await import('@app/elements/loader/app-loader.element')

	let loader = document.body.querySelector('app-loader')

	if (show && !loader) {
		loader = document.createElement('app-loader')
		render(loader, document.body)
	}

	if (!show && loader) {
		loader.remove()
	}
}
