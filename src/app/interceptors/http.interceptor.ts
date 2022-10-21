import { loading } from '../services/loading.service'
import { notify } from '../services/notify.service'

const { fetch: originalFetch } = window

window.fetch = async (...args) => {
    loading(true)
    let [resource, config] = args
    let response = new Response()
    try {
        response = await originalFetch(resource, config)
        if (!response.ok) {
            const error = await response.clone().json()
            notify(error?.message, 'danger', 10000)
            return Promise.reject(response)
        }
    } catch (error: any) {
        notify(`${resource} ${error?.message}`, 'danger', 10000)
        return Promise.reject(error)
    } finally {
        loading(false)
    }
    return response
}
