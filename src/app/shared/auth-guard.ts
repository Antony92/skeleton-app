import { Commands, RouteContext } from '@vaadin/router'
import { getUser } from '../shared/auth'

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