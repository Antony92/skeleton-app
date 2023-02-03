import { ReplaySubject } from 'rxjs'
import { SearchParams } from '../types/search.type'
import { searchParamsToURL } from '../utils/url'

const $navigation = new ReplaySubject<string>()

const $navigationObservable = $navigation.asObservable()

export const navigation = () => $navigationObservable

export const navigate = async (path: string, searchParams?: SearchParams) => {
    const app = document.querySelector('app-root')!
    await app.router.goto(path)
    navigationEvent(path)
    const search = searchParams ? searchParamsToURL(searchParams) : ''
	history.pushState(null, '', `${path}${search}`)
}

export const getRouteParams = () => {
    const app = document.querySelector('app-root')!
    return app.router.params
} 

export const navigationEvent = (path: string) => $navigation.next(path)
