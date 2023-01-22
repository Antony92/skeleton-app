export const toQueryParams = (params: { [key: string]: any }) => {
	const searchParams = new URLSearchParams()
	Object.keys(params)
		.filter((key) => params[key] != null && params[key] != undefined && params[key] !== '')
		.map((key) => searchParams.append(key, params[key].toString()))
	const query = searchParams.toString()
	return query ? `?${query}` : ``
}
