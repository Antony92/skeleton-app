import { request } from '../http/request'
import { toQueryParams } from '../utils/http'
import { SearchQuery } from '../types/search.type'

export const getProducts = async (search?: string, limit = 10) => {
	try {
		const req = await request(`https://dummyjson.com/products${toQueryParams({ q: search, limit })}`)
		const res = await req.json()
		return res?.products ?? []
	} catch (error) {
		console.error(error)
	}
	return []
}

export const getUsers = async (query?: SearchQuery) => {
	try {
		const params = toQueryParams({
			q: query?.search, 
			_start: query?.skip || 0, 
			_limit: query?.limit || 10,
			id: query?.id,
			name_like: query?.name,
			username_like: query?.username,
			email_like: query?.email,
			website_like: query?.website,
			'address.city': query?.['address.city'],
			_sort: query?.sortField,
			_order: query?.sort ? query.sort : null 
		})
		const req = await request(`https://jsonplaceholder.typicode.com/users${params}`, { showLoader: false })
		const res = await req.json()
		const total = req.headers.get('x-total-count')
		return {
			total: total ? parseInt(total): 0,
			users: res as any[]
		}
	} catch (error) {
		console.error(error)
	}
	return {
		total: 0,
		users: [] as any[]
	}	
}
