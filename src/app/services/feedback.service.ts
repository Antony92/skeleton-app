import { request } from '@app/http/request'

export const submitFeedback = async (feedback: { satisfaction: number; message: string }) => {
	try {
		const req = await request(`${import.meta.env.VITE_API}/feedback`, {
			method: 'POST',
			auth: true,
			json: true,
			body: JSON.stringify(feedback),
		})
		const res = await req.json()
		return res
	} catch (error) {
		console.error(error)
	}
	return null
}
