import { SearchParams } from "../types/search.type"

export const addSearchParamsToURL = (searchParams: SearchParams) => {
    const search = new URLSearchParams()
	Object.keys(searchParams)
		.filter((key) => searchParams[key] != null && searchParams[key] != undefined && searchParams[key] !== '')
		.map((key) => searchParams.set(key, searchParams[key].toString()))
    const query = search.toString()
    const url = `${window.location.pathname}` + `${query ? `?${query}` : ''}`  
    history.replaceState(null, '', url)
}

export const searchParamsToURL = (searchParams: SearchParams) => {
	const search = new URLSearchParams()
	Object.keys(searchParams)
		.filter((key) => searchParams[key] != null && searchParams[key] != undefined && searchParams[key] !== '')
		.map((key) => search.append(key, searchParams[key].toString()))
	const query = search.toString()
	return query ? `?${query}` : ``
}

export const getURLSearchParamsAsObject = () => {
	return Object.fromEntries(new URLSearchParams(window.location.search))
}
