import { BehaviorSubject } from 'rxjs'

export const isAuthenticated = () => {
    const user = JSON.parse(localStorage.getItem('user')!)
    return user?.token ? true : false
}

const $auth = new BehaviorSubject(isAuthenticated())

export const authState = $auth.asObservable()

export const login = async () => {
	try {
		const req = await fetch(`https://dummyjson.com/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'kminchelle', password: '0lelplR' })
        })
        const res = await req.json()
        if (req.ok) {
            localStorage.setItem('user', JSON.stringify(res))
            $auth.next(true)
        }
        return res
	} catch (error) {
		console.error(error)
		return null
	}
}

export const logout = async () => {
    localStorage.removeItem('user')
	$auth.next(false)
}