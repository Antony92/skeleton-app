import { request } from '@app/http/request'
import { searchParamsToQuery } from '@app/utils/url'
import type { SearchParams } from '@app/types/search.type'
import type { PaginatedResponse } from '@app/types/response.type'

export const getProducts = async (search?: string, limit = 10) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/products${searchParamsToQuery({ q: search, limit })}`)
		const res = await req.json()
		return res?.products || []
	} catch (error) {
		console.error(error)
	}
	return []
}

export const getUsers = async (params?: SearchParams): Promise<PaginatedResponse<any>> => {
	try {
		const query = searchParamsToQuery({
			q: params?.search,
			skip: params?.skip || 0,
			limit: params?.limit || 10,
			sortBy: params?.sort,
			order: params?.order,
		})
		const req = await request(`${import.meta.env.VITE_API}/users${query}`)
		const res = await req.json() as any
		return {
			total: res.total,
			data: res.users,
		}
	} catch (error) {
		console.error(error)
	}
	return {
		total: 0,
		data: [],
	}
}

export const dummyLogin = async (user: { username: string; password: string }) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/auth/login`, {
			method: 'POST',
			auth: true,
			json: true,
			body: JSON.stringify(user),
		})
		const res: any = await req.json()
		window.location.href = `${location.origin}/login?token=${res.accessToken}`
	} catch (error) {
		console.error(error)
		window.location.href = `${location.origin}/login?error=Something went wrong!`
	}
}
