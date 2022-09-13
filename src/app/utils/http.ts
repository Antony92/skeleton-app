export const toQueryParams = (params: any) => {
	const searchParams = new URLSearchParams()
	Object.keys(params)
		.filter((key) => params[key] != null && params[key] != undefined)
		.map((key) => searchParams.append(key, params[key]))
	const query = searchParams.toString()
	return query ? `?${query}` : ``
}
