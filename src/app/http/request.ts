import { getAccessToken, login, refreshTokenSilently } from '@app/shared/auth'
import { loading } from '@app/shared/loader'
import { notify } from '@app/shared/notification'

// Create new fetch request options
type RequestOptions = RequestInit & { hideLoading?: boolean; auth?: boolean; json?: boolean }

// Counter for number of request
let requestCount = 0

/**
 * Custom request method
 * @param url
 * @param options
 * @returns Promise
 */
export const request = async (url: URL | RequestInfo, options?: RequestOptions) => {
	let response = new Response()
	try {
		// Increment requests by one
		requestCount++
		// Show loading if not disabled
		await loading(!!options?.hideLoading)
		// If auth options is provided set up access token header
		if (options?.auth) {
			Object.assign(options, { headers: { ...options.headers, Authorization: `Bearer ${getAccessToken()}` } })
		}
		// If json options is provided set up content type
		if (options?.json) {
			Object.assign(options, { headers: { ...options.headers, 'Content-Type': `application/json` } })
		}
		// Execute request
		response = await fetch(url, options)
		// If response is 401 and auth option is true try to refresh token and on success repeat request otherwise redirect to login
		if (response.status === 401 && options?.auth) {
			const refreshed = await refreshTokenSilently()
			if (!refreshed) {
				login()
				return Promise.reject(response)
			}
			Object.assign(options, { headers: { ...options.headers, Authorization: `Bearer ${getAccessToken()}` } })
			response = await fetch(url, options)
		}
		// If response status is not ok display message
		if (!response.ok) {
			const error = await response.clone().json()
			notify({ message: `${url} failed: ${JSON.stringify(error)}`, variant: 'danger', duration: 6000 })
			return Promise.reject(response)
		}
	} catch (error: any) {
		notify({ message: `${error?.message || `${url} failed`}`, variant: 'danger', duration: 6000 })
		return Promise.reject(error)
	} finally {
		// Decrement request count by one and hide loading indicator if no more requests remain
		requestCount--
		if (requestCount === 0) {
			loading(false)
		}
	}
	return response
}
