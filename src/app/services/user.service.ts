import { request } from '@app/http/request'
import type { SearchParams } from '@app/types/search.type'
import { searchParamsToQuery } from '@app/utils/url'

export const getUsers = async (params?: SearchParams, loader = true) => {
	try {
		const query = searchParamsToQuery({ ...params })
		const req = await request(`${import.meta.env.VITE_API}/users${query}`, { auth: true, loader })
		const res = await req.json()
		return {
			data: res.data as [],
			total: res.total as number,
		}
	} catch (error) {
		console.error(error)
	}
	return {
		total: 0,
		data: [] as any[],
	}
}

export const createUser = async (user: { name: string; username: string; roles?: string[]; blocked?: boolean; active?: boolean }) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/user`, {
			method: 'POST',
			auth: true,
			json: true,
			body: JSON.stringify(user),
		})
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
	}
	return {
		data: null,
	}
}

export const updateUser = async (user: { id: string; name?: string; username?: string; roles?: string[]; active?: boolean; blocked?: boolean }) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/user/${user.id}`, {
			method: 'PATCH',
			auth: true,
			json: true,
			body: JSON.stringify(user),
		})
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
	}
	return {
		data: null,
	}
}

export const deleteUser = async (id: string) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/user/${id}`, {
			method: 'DELETE',
			auth: true,
		})
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
	}
	return {
		data: null,
	}
}

export const getRoles = async () => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/roles`, { auth: true })
		const res = await req.json()
		return [...res.data]
	} catch (error) {
		console.error(error)
	}
	return []
}

export const getMe = async () => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/me`, {
			auth: true,
		})
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
	}
	return {
		data: null,
	}
}
