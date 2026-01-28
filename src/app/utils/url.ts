import type { SearchParams } from '@app/types/search.type'

/**
 * Add search params to current url
 * @param searchParams
 */
export const addSearchParamsToURL = (searchParams: SearchParams) => {
	const search = new URLSearchParams()
	Object.keys(searchParams)
		.filter((key) => searchParams[key] !== null && searchParams[key] !== undefined && searchParams[key] !== '')
		.map((key) => search.set(key, searchParams[key]!.toString()))
	const query = search.toString()
	const url = `${location.pathname}${query ? `?${query}` : ''}`
	navigation.navigate(url, { history: 'replace' })
}

/**
 * Remove all search params from current URL
 */
export const clearSearchParamsFromURL = () => {
	navigation.navigate(location.pathname, { history: 'replace' })
}

/**
 * Transform search params to ready to append string for API calls
 * @param searchParams
 * @returns string with ?
 */
export const searchParamsToQuery = (searchParams: SearchParams) => {
	const search = new URLSearchParams()
	Object.keys(searchParams)
		.filter((key) => searchParams[key] !== null && searchParams[key] !== undefined && searchParams[key] !== '')
		.map((key) => search.append(key, searchParams[key]!.toString()))
	const query = search.toString()
	return query ? `?${query}` : ``
}

/**
 * Transform url search params to json object
 * @returns object
 */
export const getURLSearchParamsAsObject = () => {
	return Object.fromEntries(new URLSearchParams(location.search))
}

/**
 * Transform url search params to Map
 * @returns Map
 */
export const getURLSearchParamsAsMap = () => {
	const object = Object.fromEntries(new URLSearchParams(location.search))
	return new Map(Object.entries(object))
}
