const DefaultState = {
    showAuthModal: false,
    loading: false,
    username: '',
    email: '',
    token: localStorage.getItem('token'),
    error: ''
};
  
const AuthReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case "SHOW_AUTHMODAL":
            return {
                ...state,
                showAuthModal: true
            };

        case "CLOSE_AUTHMODAL":
            return {
                ...state,
                showAuthModal: false
            };

        case "REG_USER_LOADING":
        case "LOGIN_USER_LOADING":
        case "USER_LOADING":
            return {
                ...state,
                loading: true
            }
           
        case "LOGIN_USER_SUCCESS":
        case "REG_USER_SUCCESS":
        case "USER_LOADED":
            localStorage.setItem('token', action.payload.token[0] === 'b' ? action.payload.token.substring(1, action.payload.token.length - 1).replace("'", '') : action.payload.token.replace("'", ''))
            return {
                ...state,
                loading: false,
                token: action.payload.token,
                username: action.payload.username,
                email: action.payload.email,
                showAuthModal: false, 
            }

        case "LOGIN_USER_ERROR":
        case "REG_USER_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case "USER_LOADING_FAIL":
        case "LOGOUT_USER":
            localStorage.removeItem('token');
            return {
                ...state,
                username: '',
                email: '',
                token: '',
            }
            
        default:
            return state
    }
};

export default AuthReducer