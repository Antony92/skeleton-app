import { loading } from '../services/loader.service'
import { notify } from '../services/notify.service'

type RequestOptions = RequestInit & { showLoader?: boolean }

export const request = async (url: URL | RequestInfo, options?: RequestOptions) => {
	let response = new Response()
	try {
		await loading(options?.showLoader ?? true)
		response = await fetch(url, options)
		if (!response.ok) {
			const error = await response.clone().json()
			notify({ message: `${error?.message || `${url} failed`}`, variant: 'danger', duration: 10000, icon: 'exclamation-octagon' })
			return Promise.reject(response)
		}
	} catch (error: any) {
		notify({ message: `${error?.message || `${url} failed`}`, variant: 'danger', duration: 10000, icon: 'exclamation-octagon' })
		return Promise.reject(error)
	} finally {
		loading(false)
	}
	return response
}
