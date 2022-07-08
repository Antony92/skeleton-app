export const getProducts = async () => {
	try {
		const req = await fetch(`https://dummyjson.com/products?limit=10`)
		const res = await req.json()
		return res?.products ?? []
	} catch (error) {
		console.error(error)
		return []
	}
}

export const getUsers = async (skip?: number, limit = 10) => {
	try {
		const req = await fetch(`https://dummyjson.com/users${toQueryParams({ skip, limit })}`)
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
		return []
	}
}

export const searchForProducts = async (search?: string) => {
	try {
		const req = await fetch(`https://dummyjson.com/products/search${search ? `?q=${search}` : ``}`)
		const res = await req.json()
		return res?.products ?? []
	} catch (error) {
		console.error(error)
		return []
	}
}

const toQueryParams = (params: any) => {
	const searchParams = new URLSearchParams()
	Object.keys(params)
		.filter((key) => params[key])
		.map((key) => searchParams.append(key, params[key]))
	const query = searchParams.toString()
	return query ? `?${query}` : ``
}
