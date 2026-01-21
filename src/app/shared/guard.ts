import { getUser } from '@app/shared/auth'
import { navigate, type RouteParams } from '@app/shared/navigation'

/**
 * Authentication guard function for route with the option to provide for which roles to check
 * @param roles
 */
export const authGuard = (roles?: string[]) => {
	return async (url: URL, params: RouteParams) => {
		const user = await getUser()
		if (!user) {
			localStorage.setItem('requested-page', `${url.pathname}${url.search}` || '/')
			navigate('/login')
			return false
		}
		if (user && roles && !user.roles.some((role) => roles.includes(role))) {
			navigate('/page-not-found')
			return false
		}
		return true
	}
}

/**
 * Triggers a sequence of guards againts the route (useful if you need multiple guards)
 * @param guards
 * @returns boolean
 */
export const sequence = (guards: ((url: URL, params: RouteParams) => Promise<boolean> | boolean)[]) => {
	return async (url: URL, params: RouteParams) => {
		for (const guard of guards) {
			const result = await guard(url, params)
			if (!result) {
				return result // Stop if a guard returns false
			}
		}
	}
}
