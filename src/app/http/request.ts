import { getAccessToken, login, refreshTokenSilently } from '../services/auth.service'
import { loading } from '../shared/loader'
import { notify } from '../shared/notification'

let requestCount = 0

type RequestOptions = RequestInit & { showLoading?: boolean; auth?: boolean; json?: boolean }

export const request = async (url: URL | RequestInfo, options?: RequestOptions) => {
	let response = new Response()
	try {
		requestCount++
		await loading(options?.showLoading ?? true)
		if (options?.auth) {
			Object.assign(options, { headers: { ...options.headers, Authorization: `Bearer ${getAccessToken()}` } })
		}
		if (options?.json) {
			Object.assign(options, { headers: { ...options.headers, 'Content-Type': `application/json` } })
		}
		response = await fetch(url, options)
		if (response.status === 401 && options?.auth) {
			const refresh = await refreshTokenSilently()
			if (!refresh) {
				login()
				return Promise.reject(response)
			}
			Object.assign(options, { headers: { ...options.headers, Authorization: `Bearer ${getAccessToken()}` } })
			response = await fetch(url, options)
		}
		if (!response.ok) {
			const error = await response.clone().json()
			notify({ message: `${url} failed: ${JSON.stringify(error)}`, variant: 'danger', duration: 6000 })
			return Promise.reject(response)
		}
	} catch (error: any) {
		notify({ message: `${error?.message || `${url} failed`}`, variant: 'danger', duration: 6000 })
		return Promise.reject(error)
	} finally {
		requestCount--
		if (requestCount === 0) {
			loading(false)
		}
	}
	return response
}
