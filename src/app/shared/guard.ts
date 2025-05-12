import type { RouteContext, Commands, RedirectResult } from '@vaadin/router'
import { getUser } from '@app/shared/auth'

/**
 * Authentication guard function for route with the option to provide for which roles to check
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

/**
 * Triggers a sequence of guards againts the route (useful if you need multiple guards)
 * @param actions 
 * @returns RedirectResult or undefined
 */
export const sequence = (
	actions: ((context: RouteContext, command: Commands) => Promise<RedirectResult | undefined>)[]
) => {
	return async (context: RouteContext, command: Commands) => {
		for (const action of actions) {
			const result = await action(context, command)
			if (result) {
				return result // Stop if an action returns a command
			}
		}
	} 
}
