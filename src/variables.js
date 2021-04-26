export const API_DOMAIN = 'http://localhost:8000'

export const AUTH_CONFIG = {
    headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
    }
}