export type User = {
	id: string
	name: string
	username: string
	roles: string[]
	impersonated?: string
} | null

export const Role = {
	GUEST: 'GUEST',
	ADMIN: 'ADMIN',
}