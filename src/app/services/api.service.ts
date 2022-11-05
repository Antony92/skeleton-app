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

export const getUsers = async (skip = 0, limit = 10) => {
	try {
		const req = await request(`https://dummyjson.com/users${toQueryParams({ skip, limit })}`)
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
	}
	return null	
}
