import { BehaviorSubject } from 'rxjs'
import { loading } from './loading.service'
import { notify } from './notify.service'

export const isAuthenticated = () => {
    const user = JSON.parse(localStorage.getItem('user')!)
    return user?.token ? true : false
}

export const setUser = (user: unknown) => {
    localStorage.setItem('user', JSON.stringify(user))
    $auth.next(true)
}

export const removeUser = () => {
    localStorage.removeItem('user')
    $auth.next(false)
}

export const getUser = () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

const $auth = new BehaviorSubject(isAuthenticated())

export const authState = $auth.asObservable()

export const login = async () => {
    loading(true)
	try {
		const req = await fetch(`https://dummyjson.com/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'kminchelle', password: '0lelplR' })
        })
        const res = await req.json()
        if (!req.ok) throw { message: res?.message }
        setUser(res)
        return res
	} catch (error: any) {
		console.error(error)
        notify(error?.message, 'danger', 10000)
		return null
	} finally {
        loading(false)
    }
}

export const logout = async () => {
    removeUser()
}