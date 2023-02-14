import { BehaviorSubject, shareReplay } from 'rxjs'
import { User } from '../types/user.type'

const $user = new BehaviorSubject<User>(null)

const $userObservable = $user.asObservable().pipe(shareReplay(1))

export const setUser = (user: User) => {
	$user.next(user)
}

export const removeUser = () => {
	$user.next(null)
}

export const getUser = () => $userObservable
