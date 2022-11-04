import { BehaviorSubject, shareReplay } from 'rxjs'

const $user = new BehaviorSubject<any>(null)

const userObservable = $user.asObservable().pipe(shareReplay(1))

export const setUser = (user: any) => {
	$user.next(user)
}

export const removeUser = () => {
	$user.next(null)
}

export const getUser = () => {
    return userObservable
}
