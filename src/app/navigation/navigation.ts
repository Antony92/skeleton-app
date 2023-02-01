import { ReplaySubject } from 'rxjs'

const navigationEvent = new ReplaySubject<string>()

export const navigation = () => navigationEvent.asObservable()

export const navigate = async (path: string) => {
    const app = document.querySelector('app-root')!
    await app.router.goto(path)
    triggerNavigationEvent(path)
	history.pushState(null, '', path)
}

export const getRouteParams = () => {
    const app = document.querySelector('app-root')!
    return app.router.params
} 

export const triggerNavigationEvent = (path: string) => navigationEvent.next(path)
