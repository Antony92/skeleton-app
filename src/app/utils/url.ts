import { SearchParams } from '../types/search.type'

export const addSearchParamsToURL = (searchParams: SearchParams) => {
	const search = new URLSearchParams()
	Object.keys(searchParams)
		.filter((key) => searchParams[key] != null && searchParams[key] != undefined && searchParams[key] !== '')
		.map((key) => search.set(key, searchParams[key].toString()))
	const query = search.toString()
	const url = `${window.location.pathname}` + `${query ? `?${query}` : ''}`
	history.replaceState(null, '', url)
}

export const clearSearchParamsFromURL = () => {
	history.replaceState(null, '', window.location.pathname)
}

export const searchParamsToQuery = (searchParams: SearchParams) => {
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

export const getURLSearchParamsAsMap = () => {
	const object = Object.fromEntries(new URLSearchParams(window.location.search))
	return new Map(Object.entries(object)) 
}