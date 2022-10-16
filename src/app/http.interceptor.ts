import { loading } from './services/loading.service'

const { fetch: originalFetch } = window

window.fetch = async (...args) => {
	let [resource, config] = args
	loading(true)
	const response = await originalFetch(resource, config)
	loading(false)
	return response
}
