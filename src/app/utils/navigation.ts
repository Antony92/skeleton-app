import { Subject } from 'rxjs'

const $navigation = new Subject<string>()

export const getNavigation = () => $navigation.asObservable()

export const navigate = (path: string) => {
    history.pushState(null, '', path)
    $navigation.next(path)
}
