import { request } from '../http/request'

export const getServerEvents = async () => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/server-events`, { auth: true })
		const res = await req.json()
		return {
			data: res.data as [],
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

export const createServerEvent = async (event: { type: 'info' | 'warning' | 'error'; message: string }) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/server-event`, {
			method: 'POST',
			auth: true,
			json: true,
			body: JSON.stringify(event),
		})
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
	}
	return {
		data: null,
	}
}

export const updateServerEvent = async (event: { id: string; type?: 'info' | 'warning' | 'error'; message?: string }) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/server-event/${event.id}`, {
			method: 'PATCH',
			auth: true,
			json: true,
			body: JSON.stringify(event),
		})
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
	}
	return {
		data: null,
	}
}

export const deleteServerEvent = async (id: string) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/server-event/${id}`, {
			method: 'DELETE',
			auth: true,
		})
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
	}
	return {
		data: null,
	}
}
