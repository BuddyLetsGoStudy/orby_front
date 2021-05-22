export const API_DOMAIN = 'http://localhost:8000'
// export const API_DOMAIN = 'https://api.orby.space'


export const AUTH_CONFIG = () => ({
    headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
    }
})

export const AUTH_JSON_CONFIG = () => ({
    headers: {
        'Content-Type': `application/json`,
        'Authorization': `Token ${localStorage.getItem('token')}`
    }
})

export const AUTH_FORM_CONFIG = () => ({
    headers: {
        'Content-Type': `multipart/form-data`,
        'Authorization': `Token ${localStorage.getItem('token')}`
    }
})

export const GUEST_CONFIG = {
    headers: {
        'Content-Type': `application/json`
    }
}