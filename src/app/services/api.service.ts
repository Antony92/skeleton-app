import { request } from '../http/request'
import { searchParamsToURL } from '../utils/url'
import { SearchParams } from '../types/search.type'

export const getProducts = async (search?: string, limit = 10) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/products${searchParamsToURL({ q: search, limit })}`)
		const res = await req.json()
		return res?.products || []
	} catch (error) {
		console.error(error)
	}
	return []
}

export const getUsers = async (query?: SearchParams) => {
	try {
		const params = searchParamsToURL({
			q: query?.search, 
			_start: query?.skip || 0, 
			_limit: query?.limit || 10,
			id: query?.id,
			name_like: query?.name,
			username_like: query?.username,
			email_like: query?.email,
			website_like: query?.website,
			'address.city': query?.['address.city'],
			_sort: query?.sort,
			_order: query?.order 
		})
		const req = await request(`https://jsonplaceholder.typicode.com/users${params}`)
		const res = await req.json()
		const total = req.headers.get('x-total-count')
		return {
			total: total ? parseInt(total) : 0,
			data: res as any[]
		}
	} catch (error) {
		console.error(error)
	}
	return {
		total: 0,
		data: [] as any[]
	}	
}
