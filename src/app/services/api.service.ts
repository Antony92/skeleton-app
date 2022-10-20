import { toQueryParams } from '../utils/http'
import { loading } from './loading.service'
import { notify } from './notify.service'

export const getProducts = async (search?: string, limit = 10) => {
	loading(true)
	try {
		const req = await fetch(`https://dummyjson.com/products${toQueryParams({ q: search, limit })}`)
		const res = await req.json()
		if (!req.ok) throw { message: res }
		const products: any[] = res.products
		return products
	} catch (error: any) {
		console.error(error)
		notify(error?.message, 'danger', 10000)
		return []
	} finally {
		loading(false)
	}
}

export const getUsers = async (skip = 0, limit = 10) => {
	loading(true)
	try {
		const req = await fetch(`https://dummyjson.com/users${toQueryParams({ skip, limit })}`)
		const res = await req.json()
		if (!req.ok) throw { message: res }
		return res
	} catch (error: any) {
		console.error(error)
		notify(error?.message, 'danger', 10000)
		return []
	} finally {
		loading(false)
	}
}
