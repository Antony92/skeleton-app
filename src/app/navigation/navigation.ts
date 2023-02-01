import { ReplaySubject } from 'rxjs'

const $navigation = new ReplaySubject<string>()

const $navigationObservable = $navigation.asObservable()

export const navigation = () => $navigationObservable

export const navigate = async (path: string) => {
    const app = document.querySelector('app-root')!
    await app.router.goto(path)
    navigationEvent(path)
	history.pushState(null, '', path)
}

export const getRouteParams = () => {
    const app = document.querySelector('app-root')!
    return app.router.params
} 

export const navigationEvent = (path: string) => $navigation.next(path)
