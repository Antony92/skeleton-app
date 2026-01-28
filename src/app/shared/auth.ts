import { request } from '@app/http/request'
import type { User } from '@app/types/user.type'
import { signal } from '@lit-labs/signals'

const $user = signal<User>(null)

export const getUser = () => $user.get()

export const getAccessToken = () => $user.get()?.accessToken

export const setUser = (user: User) => $user.set(user)

export const hasUserRole = (roles: string[]) => {
	const user = $user.get()
	return user && user.roles.some((role) => roles.includes(role))
}

export const login = () => {
	// location.href = `${import.meta.env.VITE_API}/auth/login/microsoft`
	location.href = `${location.origin}/login`
}

export const logout = async () => {
	try {
		setUser(null)
		const req = await request(`${import.meta.env.VITE_API}/auth/logout`, { method: 'POST', credentials: 'include' })
		const res = await req.json()
		return res
	} catch (error) {
		console.error('Logout failed: ', error)
	}
}

export const refreshTokenSilently = async () => {
	if (location.pathname === '/login') {
		return true
	}
	try {
		const req = await fetch(`${import.meta.env.VITE_API}/auth/refresh`, { credentials: 'include' })
		if (!req.ok) {
			return false
    }
		if (!req.ok) return false
		const { accessToken } = await req.json()
		const { user } = JSON.parse(atob(accessToken.split('.')[1]))
		setUser({ ...user, accessToken })
		return true
	} catch (error) {
    console.error('Token refresh failed: ', error)
		return false
	}
}

export const impersonate = async (username: string) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/auth/impersonate`, {
			method: 'POST',
			credentials: 'include',
			auth: true,
			json: true,
			body: JSON.stringify({ username }),
		})
		if (!req.ok) return false
		const { accessToken } = await req.json()
		const { user } = JSON.parse(atob(accessToken.split('.')[1]))
		setUser({ ...user, accessToken })
		return true
	} catch (error) {
	  console.error('Impersonation failed: ', error)
		return false
	}
}
