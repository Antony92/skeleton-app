import { request } from '../http/request'

export const login = async () => {
	try {
		const req = await request(`https://dummyjson.com/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: 'kminchelle', password: '0lelplR' }),
			showLoader: false
		})
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
	}
}

export const logout = async () => {
	// TODO
}
