import { getAccessToken, login, refreshTokenSilently } from '@app/shared/auth'
import { loading } from '@app/shared/loader'
import { notify } from '@app/shared/notification'

type RequestOptions = RequestInit & { loader?: boolean; auth?: boolean; json?: boolean }

// Counter for number of request
let requestCount = 0

export const request = async (url: URL | RequestInfo, options?: RequestOptions) => {
	const { loader = true, auth = false, json = false } = options ?? {}

	// 1. Prepare Headers immutably
	const headers = new Headers(options?.headers)
	if (auth) headers.set('Authorization', `Bearer ${getAccessToken()}`)
	if (json) headers.set('Content-Type', 'application/json')

	try {
		requestCount++
		if (loader) await loading(true)

		// 2. Initial Fetch
		let response = await fetch(url, { ...options, headers })

		// 3. Handle Token Refresh (401)
		if (response.status === 401 && auth) {
			const refreshed = await refreshTokenSilently()
			if (refreshed) {
				headers.set('Authorization', `Bearer ${getAccessToken()}`)
				response = await fetch(url, { ...options, headers })
			} else {
				login()
				throw response
			}
		}

		if (!response.ok) {
			const error = await response.clone().json()
			notify({ message: `${url} failed: ${JSON.stringify(error)}`, variant: 'error', duration: 6000 })
		}

		return response
	} catch (error: unknown) {
		notify({ message: `${url} failed`, variant: 'error', duration: 6000 })
		throw error
	} finally {
		requestCount--
		if (requestCount <= 0) {
			requestCount = 0
			loading(false)
		}
	}
}
