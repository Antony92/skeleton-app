import { Subject } from 'rxjs'

const $navigation = new Subject<string>()

export const getNavigation = () => $navigation.asObservable()

export const navigate = (path: string) => {
    $navigation.next(path)
}
