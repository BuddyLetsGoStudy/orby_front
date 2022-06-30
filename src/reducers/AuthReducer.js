const DefaultState = {
    showAuthModal: false,
    loading: false,
    username: '',
    email: '',
    token: localStorage.getItem('token'),
    // hints: localStorage.getItem('hints') === null  ? false : localStorage.getItem('hints'),
    hints: localStorage.getItem('hints') ? JSON.parse(localStorage.getItem('hints')) : 
    {
        plus: true,
        howtocreate: true,
        publish: true,
        published: true
    },
    error: '',
    avatar: '',
    redirect: false
};
  console.log()
const AuthReducer = (state = DefaultState, action) => {
    switch (action.type) {
        case "SHOW_AUTHMODAL":
            console.log(action.payload.redirect, 'suka(')
            return {
                ...state,
                showAuthModal: true,
                redirect: action.payload.redirect
            };

        case "CLOSE_AUTHMODAL":
            return {
                ...state,
                error: false,
                showAuthModal: false,
                redirect: false
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
                redirect: false,
                
                token: action.payload.token,
                username: action.payload.username,
                email: action.payload.email,
                avatar: action.payload.avatar,
                error: false,
                showAuthModal: false, 
                hints: JSON.parse(localStorage.getItem('hints'))
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
                token: null,
                avatar: '',
                error: false,
            }
            
        case "HINTS_OFF": 
            localStorage.setItem('hints', JSON.stringify({
                plus: false,
                howtocreate: false,
                publish: false,
                published: false
            }))
            return {
                ...state,
                hints: {
                    plus: false,
                    howtocreate: false,
                    publish: false,
                    published: false
                }
            }
        case "HINTS_ON": 
            localStorage.setItem('hints', JSON.stringify({
                plus: true,
                howtocreate: true,
                publish: true,
                published: true
            }));
            return {
                ...state,
                hints: {
                    plus: true,
                    howtocreate: true,
                    publish: true,
                    published: true
                }
            }
        case "HINT_SEEN":
            const newHints = {
                ...state.hints,
                [action.payload.hint]: false
            }
            localStorage.setItem('hints', JSON.stringify(newHints))
            return {
                ...state,
                hints: newHints
            }
        default:
            return state
    }
};

export default AuthReducer