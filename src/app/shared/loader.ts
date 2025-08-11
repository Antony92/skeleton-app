export const loading = async (show = false) => {
	await import('@app/elements/loader/app-loader.element')

	let loader = document.body.querySelector('app-loader')

	if (!loader) {
		loader = document.createElement('app-loader')
		document.body.appendChild(loader)
	}

	loader.active = show
}
