import { RouteContext, Commands } from '@vaadin/router'
import { getUser } from '@app/shared/auth'

/**
 * Authentication guard function for router with the option to provide for which roles to check
 * @param roles
 */
export const authGuard = (roles?: string[]) => {
	return async (context: RouteContext, command: Commands) => {
		const user = await getUser()
		if (!user) {
			localStorage.setItem('requested-page', `${context.pathname}${context.search}` || '/')
			return command.redirect('/login')
		}
		if (user && roles && !user.roles.some((role: string) => roles.includes(role))) {
			return command.redirect('/page-not-found')
		}
	}
}
