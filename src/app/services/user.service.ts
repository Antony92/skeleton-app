import { ReplaySubject } from 'rxjs'

const $user = new ReplaySubject<any>()

const $userObservable = $user.asObservable()

export const setUser = (user: any) => {
	$user.next(user)
}

export const removeUser = () => {
	$user.next(null)
}

export const getUser = () => $userObservable
