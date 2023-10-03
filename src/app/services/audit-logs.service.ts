import { request } from '../http/request'
import { SearchParams } from '../types/search.type'
import { searchParamsToQuery } from '../utils/url'

export const getAuditLogs = async (params?: SearchParams) => {
	try {
		const query = searchParamsToQuery({ ...params })
		const req = await request(`${import.meta.env.VITE_API}/audit-logs${query}`, { auth: true })
		const res = await req.json()
		return {
			data: res.data as any[],
			total: res.total as number,
		}
	} catch (error) {
		console.error(error)
	}
	return {
		total: 0,
		data: [] as any[],
	}
}