import { Commands, Context } from '@vaadin/router'
import { getUser } from '../services/auth.service'

export const authGuard = (roles?: string[]) => {
	return async (context: Context, command: Commands) => {
		const user = await getUser()
		if (!user) {
			localStorage.setItem('requested-page', context.pathname + context.search || '/')
			return command.redirect('/login')
		}
		if (user && roles && !user.roles?.some((role: string) => roles.includes(role))) {
			return command.redirect('/page-not-found')
		}
	}
}

export const hasUserRole = async (roles?: string[]) => {
    const user = await getUser()
    return user && roles && user.roles?.some((role: string) => roles.includes(role))
}