import { request } from '@app/http/request'
import { BehaviorSubject, firstValueFrom } from 'rxjs'
import { User } from '@app/types/user.type'

// in memory access token
let accessToken = ''

// user subject which starts null by default until user login
const $user = new BehaviorSubject<User>(null)

// user observable for subscriptions
const $userObservable = $user.asObservable()

/**
 * Set current user (should be called on login or impersonation)
 * @param user
 */
export const setUser = (user: User) => $user.next(user)

/**
 * Remove current user (should be called on logout or end impersonation)
 */
export const removeUser = () => $user.next(null)

/**
 * Get user observable to listen for user changes
 * @returns Observable
 */
export const getUserObservable = () => $userObservable

/**
 * Set access token
 * @param token
 * @returns string
 */
export const setAccessToken = (token: string) => (accessToken = token)

/**
 * Get access token
 * @returns string
 */
export const getAccessToken = () => accessToken

/**
 * Get current user
 * @returns Promise
 */
export const getUser = () => firstValueFrom(getUserObservable())

/**
 * Check if user has roles
 * @param roles
 * @returns boolean
 */
export const hasUserRole = async (roles: string[]) => {
	const user = await getUser()
	return !!user && roles && user.roles.some((role: string) => roles.includes(role))
}

/**
 * Login using oauth
 */
export const login = () => {
	// window.location.href = `${import.meta.env.VITE_API}/auth/login/microsoft`
	window.location.href = `${import.meta.env.VITE_API}/login`
}

/**
 * Logout
 */
export const logout = async () => {
	try {
		removeUser()
		const req = await request(`${import.meta.env.VITE_API}/auth/logout`, { method: 'POST', credentials: 'include' })
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
	}
}

/**
 * Try to impersonate user
 * @param username
 * @returns boolean
 */
export const impersonate = async (username: string) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/auth/impersonate`, {
			method: 'POST',
			credentials: 'include',
			auth: true,
			json: true,
			body: JSON.stringify({ username }),
		})
		if (req.ok) {
			const res = await req.json()
			const { user } = JSON.parse(window.atob(res.accessToken.split('.')[1]))
			setAccessToken(res.accessToken)
			setUser(user)
		}
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

/**
 * Try to refresh token
 * @returns boolean
 */
export const refreshTokenSilently = async () => {
	if (location.pathname === '/login') {
		return true
	}
	try {
		const req = await fetch(`${import.meta.env.VITE_API}/auth/refresh`, { credentials: 'include' })
		if (req.ok) {
			const res = await req.json()
			const { user } = JSON.parse(window.atob(res.accessToken.split('.')[1]))
			setAccessToken(res.accessToken)
			setUser(user)
		}
		return req.ok
	} catch (error) {
		console.error(error)
		return false
	}
}
