import { request } from '@app/http/request'
import { searchParamsToQuery } from '@app/utils/url'
import { SearchParams } from '@app/types/search.type'

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

export const getUsers = async (params?: SearchParams) => {
	try {
		const query = searchParamsToQuery({
			q: params?.search,
			_start: params?.skip || 0,
			_limit: params?.limit || 10,
			id: params?.id,
			name_like: params?.name,
			username_like: params?.username,
			email_like: params?.email,
			website_like: params?.website,
			'address.city': params?.['address.city'],
			_sort: params?.sort,
			_order: params?.order,
		})
		const req = await request(`https://jsonplaceholder.typicode.com/users${query}`)
		const res = await req.json()
		const total = req.headers.get('x-total-count')
		return {
			total: total ? parseInt(total) : 0,
			data: res as any[],
		}
	} catch (error) {
		console.error(error)
	}
	return {
		total: 0,
		data: [] as any[],
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
