export const toQueryParams = (params: any) => {
	const searchParams = new URLSearchParams()
	Object.keys(params)
		.filter((key) => params[key])
		.map((key) => searchParams.append(key, params[key]))
	const query = searchParams.toString()
	return query ? `?${query}` : ``
}
