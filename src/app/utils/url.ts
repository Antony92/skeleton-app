import type { SearchParams } from '@app/types/search.type'

/**
 * Transform search params to ready to append string for API calls
 * @param searchParams
 * @returns string with ?
 */
export const searchParamsToQuery = (params: SearchParams) => {
	const search = new URLSearchParams()
	Object.entries(params).forEach(([key, value]) => {
		if (value != null && value !== '') {
			search.set(key, String(value))
		}
	})
	const query = search.toString()
	return query ? `?${query}` : ``
}
