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
