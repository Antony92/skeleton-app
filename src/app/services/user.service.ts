import { BehaviorSubject, shareReplay } from 'rxjs'

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null

const $user = new BehaviorSubject<any>(user)

const userObservable = $user.asObservable().pipe(shareReplay(1))

export const setUser = (user: any) => {
	localStorage.setItem('user', JSON.stringify(user))
	$user.next(user)
}

export const removeUser = () => {
	localStorage.removeItem('user')
	$user.next(null)
}

export const getUser = () => {
    return userObservable
}
