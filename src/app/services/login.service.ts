import { request } from '../http/request'
import { removeUser, setUser } from './user.service'

export const login = async () => {
	try {
		const req = await request(`https://dummyjson.com/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: 'kminchelle', password: '0lelplR' }),
		})
		const res = await req.json()
		setUser(res)
	} catch (error) {
		console.error(error)
	}
}

export const logout = async () => {
	removeUser()
}
