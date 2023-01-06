import { loading } from '../services/loading.service'
import { notify } from '../services/notify.service'

interface RequestOptions extends RequestInit {
	loading?: boolean
}

export const request = async (url: URL | RequestInfo, options?: RequestOptions) => {
	let response = new Response()
	try {
		loading(options?.loading || true)
		response = await fetch(url, options)
		if (!response.ok) {
			const error = await response.clone().json()
			notify(error?.message, 'danger', 10000)
			return Promise.reject(response)
		}
	} catch (error: any) {
		notify(`${url} ${error?.message}`, 'danger', 10000)
		return Promise.reject(error)
	} finally {
		loading(false)
	}
	return response
}
