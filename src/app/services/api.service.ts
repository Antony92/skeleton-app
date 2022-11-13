import { request } from '../http/request'
import { toQueryParams } from '../utils/http'

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

export const getUsers = async (query: SearchQuery) => {
	try {
		const params = toQueryParams({
			q: query.search, 
			_start: query.skip, 
			_limit: query.limit,
			id: query.id,
			name_like: query.name,
			username_like: query.username,
			email_like: query.email,
			website_like: query.website,
			'address.city': query.city,
			_sort: query.sortField,
			_order: query.sortOrder ? query.sortOrder === 1 ? 'asc' : 'desc' : null 
		})
		const req = await request(`https://jsonplaceholder.typicode.com/users${params}`)
		const res = await req.json()
		return {
			total: req.headers.get('x-total-count'),
			users: res
		}
	} catch (error) {
		console.error(error)
	}
	return null	
}
