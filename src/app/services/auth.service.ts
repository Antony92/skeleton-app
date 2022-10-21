import { BehaviorSubject } from 'rxjs'

export const isAuthenticated = () => {
    const user = getUser()
    return user && user.token
}

export const setUser = (user: unknown) => {
    if (!user) return
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
    try {
        const req = await fetch(`https://dummyjson.com/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'kminchelle', password: '0lelplR' })
        })
        const res = await req.json()
        setUser(res)
    } catch (error) {
        console.error(error)
    }
}

export const logout = async () => {
    removeUser()
}