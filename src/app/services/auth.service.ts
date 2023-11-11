import { request } from '../http/request'
import { BehaviorSubject, lastValueFrom, shareReplay, take } from 'rxjs'
import { User } from '../types/user.type'

let accessToken = ''

const $user = new BehaviorSubject<User>(null)

const $userObservable = $user.asObservable().pipe(shareReplay(1))

export const setUser = (user: User) => {
	$user.next(user)
}

export const removeUser = () => {
	$user.next(null)
}

export const getUserObservable = () => $userObservable

export const setAccessToken = (token: string) => (accessToken = token)

export const getAccessToken = () => accessToken

export const getUser = async () => await lastValueFrom(getUserObservable().pipe(take(1)))

export const login = () => {
	window.location.href = `${import.meta.env.VITE_API}/auth/login/microsoft`
}

export const logout = async () => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/auth/logout`, { method: 'POST', credentials: 'include' })
		const res = await req.json()
	} catch (error) {
		console.error(error)
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
		if (req.ok) {
			const res = await req.json()
			accessToken = res.accessToken
			const { user } = JSON.parse(window.atob(res.accessToken.split('.')[1]))
			setUser(user)
		}
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export const refreshTokenSilently = async () => {
	try {
		const req = await fetch(`${import.meta.env.VITE_API}/auth/refresh`, { credentials: 'include' })
		if (req.ok) {
			const res = await req.json()
			accessToken = res.accessToken
			const { user } = JSON.parse(window.atob(res.accessToken.split('.')[1]))
			setUser(user)
		}
		return req.ok
	} catch (error) {
		console.error(error)
	}
	return false
}